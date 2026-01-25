# getContext 函数案例

## 1. getContext 函数实现

```typescript
import { Message, Mode } from '../types';

/**
 * 获取发送给模型的上下文
 * @param messages - 历史消息列表
 * @param mode - 当前模式
 * @returns 包含 system prompt 的上下文数组
 */
function getContext(messages: Message[], mode: Mode): Message[] {
  // 1. 创建 system prompt 消息
  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: mode.systemPrompt,
  };

  // 2. 获取最近 N 条对话
  const recentMessages = messages.slice(-mode.contextLength);

  // 3. 组合返回：system prompt + 最近 N 条消息
  return [systemMessage, ...recentMessages];
}

export default getContext;
```

## 2. 使用示例

```typescript
import { useState } from 'react';
import getContext from '../utils/context';
import { Mode, Message } from '../types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);

  const handleSend = async (content: string) => {
    // 1. 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];

    // 2. 获取上下文（包含 system prompt）
    const context = getContext(newMessages, currentMode);

    // 3. 发送给 API
    const reply = await sendMessage(content, context);

    // 4. 添加 AI 回复
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
    };
    setMessages([...newMessages, assistantMessage]);
  };
}
```

## 3. 上下文管理原理

### 为什么需要上下文管理？

1. **Token 限制**：模型有最大 token 限制（通常是 4096 或 8192）
2. **成本控制**：发送更多消息 = 更多 token = 更高成本
3. **性能优化**：减少不必要的历史信息，提高响应速度
4. **保持连贯性**：保留最近的对话，确保上下文连贯

### 滑动窗口机制

```
历史消息: [A, B, C, D, E, F, G, H, I, J, K, L]
                ↑
            contextLength = 5

发送给模型: [System, H, I, J, K, L]
```

## 4. System Prompt 注入

```typescript
// 发送给 API 的最终结构
const context = getContext(messages, mode);

// context 的结构：
[
  {
    id: 'system',
    role: 'system',           // ← System Prompt
    content: '你是前端导师...'
  },
  {
    id: 'msg-1',
    role: 'user',
    content: '怎么学 React?'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: '我建议...'
  },
  {
    id: 'msg-3',
    role: 'user',
    content: '推荐个教程'
  }
]
```

## 5. 测试用例

```typescript
// 测试上下文截断
const messages = Array.from({ length: 20 }, (_, i) => ({
  id: `msg-${i}`,
  role: 'user',
  content: `Message ${i}`,
}));

const mode = { contextLength: 5 };
const context = getContext(messages, mode);

console.log(context.length); // 应该是 6 (1 system + 5 messages)
console.log(context[1].content); // 应该是 "Message 15" (倒数第 5 条)
```

## 6. 不同模式的上下文长度

```typescript
// 普通聊天模式：10 条
const context1 = getContext(messages, MODES[0]);
console.log(context1.length); // 11 (1 system + 10 messages)

// 前端导师模式：15 条
const context2 = getContext(messages, MODES[1]);
console.log(context2.length); // 16 (1 system + 15 messages)

// 代码审查模式：20 条
const context3 = getContext(messages, MODES[2]);
console.log(context3.length); // 21 (1 system + 20 messages)
```

## 你的任务

1. 在 `src/utils/` 目录下创建 `context.ts` 文件
2. 实现 `getContext` 函数
3. 导出函数供其他模块使用
4. 编写测试用例验证功能

完成后告诉我："我写好了，你检查一下 @src/utils/context.ts"