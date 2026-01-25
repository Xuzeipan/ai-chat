# getContext Function Example

## 1. getContext Function Implementation

```typescript
import { Message, Mode } from '../types';

/**
 * Get context to send to the model
 * @param messages - Historical message list
 * @param mode - Current mode
 * @returns Context array containing system prompt
 */
function getContext(messages: Message[], mode: Mode): Message[] {
  // 1. Create system prompt message
  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: mode.systemPrompt,
  };

  // 2. Get recent N messages
  const recentMessages = messages.slice(-mode.contextLength);

  // 3. Combine and return: system prompt + recent N messages
  return [systemMessage, ...recentMessages];
}

export default getContext;
```

## 2. Usage Example

```typescript
import { useState } from 'react';
import getContext from '../utils/context';
import { Mode, Message } from '../types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);

  const handleSend = async (content: string) => {
    // 1. Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];

    // 2. Get context (contains system prompt)
    const context = getContext(newMessages, currentMode);

    // 3. Send to API
    const reply = await sendMessage(content, context);

    // 4. Add AI reply
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
    };
    setMessages([...newMessages, assistantMessage]);
  };
}
```

## 3. Context Management Principle

### Why Do We Need Context Management?

1. **Token Limit**: Models have maximum token limits (usually 4096 or 8192)
2. **Cost Control**: More messages = more tokens = higher cost
3. **Performance Optimization**: Reduce unnecessary historical information, improve response speed
4. **Maintain Coherence**: Keep recent conversations to ensure context coherence

### Sliding Window Mechanism

```
Historical messages: [A, B, C, D, E, F, G, H, I, J, K, L]
                    ↑
                contextLength = 5

Send to model: [System, H, I, J, K, L]
```

## 4. System Prompt Injection

```typescript
// Final structure sent to API
const context = getContext(messages, mode);

// context structure:
[
  {
    id: 'system',
    role: 'system',           // ← System Prompt
    content: 'You are a frontend mentor...'
  },
  {
    id: 'msg-1',
    role: 'user',
    content: 'How to learn React?'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'I suggest...'
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Recommend a tutorial'
  }
]
```

## 5. Test Cases

```typescript
// Test context truncation
const messages = Array.from({ length: 20 }, (_, i) => ({
  id: `msg-${i}`,
  role: 'user',
  content: `Message ${i}`,
}));

const mode = { contextLength: 5 };
const context = getContext(messages, mode);

console.log(context.length); // Should be 6 (1 system + 5 messages)
console.log(context[1].content); // Should be "Message 15" (5th from last)
```

## 6. Context Length for Different Modes

```typescript
// General chat mode: 10 messages
const context1 = getContext(messages, MODES[0]);
console.log(context1.length); // 11 (1 system + 10 messages)

// Frontend mentor mode: 15 messages
const context2 = getContext(messages, MODES[1]);
console.log(context2.length); // 16 (1 system + 15 messages)

// Code reviewer mode: 20 messages
const context3 = getContext(messages, MODES[2]);
console.log(context3.length); // 21 (1 system + 20 messages)
```

## Your Task

1. Create `context.ts` file in `src/utils/` directory
2. Implement `getContext` function
3. Export function for use by other modules
4. Write test cases to verify functionality

When done, tell me: "I'm done, please check @src/utils/context.ts"
