# Sliding Window Mechanism Explanation

## What is Sliding Window?

**Sliding Window** is a strategy for managing limited resources, used in AI conversations to control the amount of conversation history sent to the model.

## Why Use Sliding Window?

### Problem: Token Limits

AI models have maximum token limits, usually 4096 or 8192 tokens. If too many historical messages are sent:

1. **Exceeding Limit**: Model refuses to process
2. **Increased Cost**: More tokens = higher fees
3. **Slower Response**: Processing more data takes longer

### Solution: Keep Only Recent Conversations

```
Full history: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T]
              ↑
          contextLength = 5

Send to model: [System, P, Q, R, S, T]
```

## How It Works

### 1. Fixed Window Size

```typescript
const contextLength = 5;  // Window size fixed to 5
```

### 2. Sliding Mechanism

As new messages arrive, the window "slides" to the latest messages:

```
Initial state:
History: [A, B, C, D, E]
Window: [A, B, C, D, E]  ← 5 messages

New message F arrives:
History: [A, B, C, D, E, F]
Window: [B, C, D, E, F]  ← Slide to latest 5, A removed

New message G arrives:
History: [A, B, C, D, E, F, G]
Window: [C, D, E, F, G]  ← Continue sliding, B removed
```

### 3. Code Implementation

```typescript
function getContext(messages: Message[], mode: Mode): Message[] {
  // 1. Create system prompt
  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: mode.systemPrompt,
  };

  // 2. Use slice(-n) to get last n messages
  const recentMessages = messages.slice(-mode.contextLength);

  // 3. Combine and return
  return [systemMessage, ...recentMessages];
}
```

## Window Size for Different Modes

```typescript
// General Chat Mode: Simple questions, don't need much context
{
  id: 'normal',
  contextLength: 10,  // Keep last 10
}

// Frontend Mentor Mode: Technical discussions, need more context to understand problems
{
  id: 'frontend-mentor',
  contextLength: 15,  // Keep last 15
}

// Code Review Mode: Need complete code context
{
  id: 'code-reviewer',
  contextLength: 20,  // Keep last 20
}
```

## Practical Example

### Scenario: Code Review Conversation

```
User: Help me review this code
AI: Sure, please paste the code
User: function sum(a, b) { return a + b; }
AI: The code looks good, but I suggest adding type checking
User: How to add it?
AI: You can write it like this...
User: Got it
User: Help me review another piece
AI: Sure, please paste it
```

**If contextLength = 3**:
```
Context sent to model:
[
  { role: "system", content: "You are a code review expert..." },
  { role: "user", content: "Got it" },
  { role: "user", content: "Help me review another piece" },
  { role: "assistant", content: "Sure, please paste it" }
]

Note: Previous code discussion is removed!
```

**If contextLength = 10**:
```
Context sent to model:
[
  { role: "system", content: "You are a code review expert..." },
  { role: "user", content: "Help me review this code" },
  { role: "assistant", content: "Sure, please paste the code" },
  { role: "user", content: "function sum(a, b) { return a + b; }" },
  { role: "assistant", content: "The code looks good..." },
  { role: "user", content: "How to add it?" },
  { role: "assistant", content: "You can write it like this..." },
  { role: "user", content: "Got it" },
  { role: "user", content: "Help me review another piece" },
  { role: "assistant", content: "Sure, please paste it" }
]

Note: Complete code discussion history is preserved!
```

## Optimization Strategies

### Strategy 1: Mark Important Messages

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  important?: boolean;  // Mark important messages
}

function getContextOptimized(messages: Message[], mode: Mode): Message[] {
  const systemMessage = { id: 'system', role: 'system', content: mode.systemPrompt };

  // Prioritize keeping important messages
  const importantMessages = messages.filter(m => m.important);
  const normalMessages = messages.filter(m => !m.important);

  // Get last N normal messages
  const recentNormal = normalMessages.slice(-(mode.contextLength - importantMessages.length));

  return [systemMessage, ...importantMessages, ...recentNormal];
}
```

### Strategy 2: Dynamic Window Size Adjustment

```typescript
function getDynamicContextLength(mode: Mode, messages: Message[]): number {
  // If in code review mode and messages contain code, increase context length
  if (mode.id === 'code-reviewer') {
    const hasCode = messages.some(m => m.content.includes('```'));
    return hasCode ? 30 : mode.contextLength;
  }
  return mode.contextLength;
}
```

### Strategy 3: Conversation Summarization

```typescript
// Summarize old conversations to save tokens
function summarizeOldMessages(messages: Message[]): Message[] {
  if (messages.length <= 10) return messages;

  const oldMessages = messages.slice(0, -10);
  const summary = generateSummary(oldMessages);  // Call API to generate summary

  return [
    {
      id: 'summary',
      role: 'assistant',
      content: `[Summary] ${summary}`,
    },
    ...messages.slice(-10),
  ];
}
```

## Summary

**Core Idea of Sliding Window**:
1. **Limit Quantity**: Keep only the last N messages
2. **Dynamic Update**: Old messages are removed when new messages arrive
3. **Maintain Coherence**: Ensure conversation context remains coherent

**Advantages**:
- ✅ Save tokens, reduce costs
- ✅ Improve response speed
- ✅ Avoid exceeding model limits
- ✅ Maintain conversation coherence

**Disadvantages**:
- ❌ Lose early conversation information
- ❌ May affect long-term memory
- ❌ Need to set window size reasonably

This is the core principle of the sliding window mechanism!
