# API 流式改造案例

## 1. sendMessageStream 函数实现

```typescript
import { Message } from '../types';

interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;
  };
}

/**
 * 流式发送消息到 Ollama API
 * @param context - 上下文消息数组（包含 system prompt）
 * @param onChunk - 接收到新内容时的回调
 * @param onComplete - 流式输出完成时的回调
 * @param onError - 发生错误时的回调
 */
export async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: true,  // 启用流式输出
  };

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      // 解码数据块
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      // 逐行解析 JSON
      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line);

          if (data.message?.content) {
            // 实时回调新内容
            onChunk(data.message.content);
          }

          if (data.done) {
            onComplete();
            return;
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
```

## 2. 传统方式 vs 流式方式

```typescript
// 传统方式：等待完整响应
export async function sendMessage(content: string, context: Message[]): Promise<string> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({ role: msg.role, content: msg.content })),
    stream: false,  // 关闭流式输出
  };

  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data.message.content;  // 返回完整内容
}

// 流式方式：逐块接收
export async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  // ... 逐块接收并实时回调
}
```

## 3. 流式输出原理

### ReadableStream API

```typescript
// 1. 获取响应体
const response = await fetch('...');
const body = response.body;  // ReadableStream

// 2. 创建读取器
const reader = body.getReader();  // ReadableStreamDefaultReader

// 3. 读取数据块
while (true) {
  const { done, value } = await reader.read();
  if (done) break;  // 读取完成

  // value 是 Uint8Array，需要解码
  const chunk = decoder.decode(value);
  processChunk(chunk);
}
```

### 数据流示意

```
API 响应流:
{"done":false,"message":{"role":"assistant","content":"你好"}}
{"done":false,"message":{"role":"assistant","content":"！我是"}}
{"done":false,"message":{"role":"assistant","content":"前端"}}
{"done":false,"message":{"role":"assistant","content":"导师"}}
{"done":true}

逐块解析:
Chunk 1 → "你好"
Chunk 2 → "！我是"
Chunk 3 → "前端"
Chunk 4 → "导师"
Chunk 5 → 完成

用户看到:
你好 → 你好！我是 → 你好！我是前端 → 你好！我是前端导师
```

## 4. 错误处理和边界情况

```typescript
// 添加超时处理
export async function sendMessageStreamWithTimeout(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  timeout: number = 60000  // 默认 60 秒
): Promise<void> {
  const timeoutId = setTimeout(() => {
    onError(new Error('Request timeout'));
  }, timeout);

  try {
    await sendMessageStream(context, onChunk, onComplete, onError);
  } finally {
    clearTimeout(timeoutId);
  }
}

// 添加重试逻辑
export async function sendMessageStreamWithRetry(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  maxRetries: number = 3
): Promise<void> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await sendMessageStream(context, onChunk, onComplete, onError);
      return;
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        onError(error as Error);
        return;
      }
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
}
```

## 5. 性能优化

```typescript
// 使用 requestAnimationFrame 优化渲染频率
let pendingUpdate = false;

function optimizedOnChunk(content: string) {
  if (!pendingUpdate) {
    pendingUpdate = true;
    requestAnimationFrame(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: msg.content + content }
          : msg
      ));
      pendingUpdate = false;
    });
  }
}
```

## 6. 测试用例

```typescript
// 测试流式输出
async function testStreamOutput() {
  const chunks: string[] = [];

  await sendMessageStream(
    context,
    (content) => {
      chunks.push(content);
      console.log('收到内容片段:', content);
    },
    () => {
      console.log('流式输出完成');
      console.log('所有片段:', chunks);
      console.log('完整内容:', chunks.join(''));
    },
    (error) => {
      console.error('流式输出错误:', error);
    }
  );
}
```

## 你的任务

1. 在 `src/services/chat.ts` 中实现 `sendMessageStream` 函数
2. 理解 ReadableStream API 的工作原理
3. 测试流式输出功能
4. 验证错误处理

完成后告诉我："我写好了，你检查一下 @src/services/chat.ts"