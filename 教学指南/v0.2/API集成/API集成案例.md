# API 集成案例 - 流式输出

## 1. StreamChunk 类型定义

```typescript
// 流式响应的数据块类型
interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;
  };
}
```

## 2. sendMessageStream 函数实现

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

## 3. 在组件中使用流式输出

```typescript
import { useState } from 'react';
import { sendMessageStream } from '../services/chat';
import { Message, Mode } from '../types';
import getContext from '../utils/context';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);

  const handleSend = async (content: string) => {
    // 1. 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    // 2. 创建空的 AI 消息占位符
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    setMessages([...newMessages, assistantMessage]);

    // 3. 获取上下文
    const context = getContext(newMessages, currentMode);

    // 4. 流式发送
    await sendMessageStream(
      context,
      // onChunk: 接收到新内容时更新消息
      (newContent: string) => {
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: msg.content + newContent }
            : msg
        ));
      },
      // onComplete: 流式输出完成
      () => {
        setLoading(false);
      },
      // onError: 错误处理
      (err: Error) => {
        setLoading(false);
        setError(err.message);
      }
    );
  };
}
```

## 4. 流式输出原理

### 传统方式 vs 流式输出

```typescript
// 传统方式：等待完整响应
const response = await fetch('...');
const data = await response.json();
const reply = data.message.content;  // 一次性显示完整内容

// 流式输出：逐块接收
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  displayChunk(chunk);  // 实时显示每个片段
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

用户看到:
你好 → 你好！ → 你好！我是 → 你好！我是前端 → 你好！我是前端导师
```

## 5. 错误处理和边界情况

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

## 6. 性能优化

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

## 你的任务

1. 在 `src/services/chat.ts` 中添加 `StreamChunk` 类型
2. 实现 `sendMessageStream` 函数
3. 导出函数供组件使用

完成后告诉我："我写好了，你检查一下 @src/services/chat.ts"