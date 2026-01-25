# Integrate Context Management Example

## 1. Update sendMessage Function

```typescript
import { Message } from '../types';

/**
 * Send message to Ollama API
 * @param content - User message content
 * @param context - Context message array (contains system prompt)
 * @returns AI reply content
 */
export async function sendMessage(
  content: string,
  context: Message[]
): Promise<string> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: false,
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

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    throw error;
  }
}
```

## 2. Integrate Context Management in App

```typescript
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { Message, Mode } from './types';
import { sendMessage } from './services/chat';
import getContext from './utils/context';
import MODES from './config/modes';
import styles from './App.module.css';

function App() {
  const [state, setState] = useState<AppState>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0],
    modes: MODES,
  });

  const handleModeChange = (mode: Mode) => {
    setState((prev) => ({
      ...prev,
      currentMode: mode,
    }));
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || state.loading) return;

    // 1. Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    };

    const newMessages = [...state.messages, userMessage];
    setState((prev) => ({
      ...prev,
      messages: newMessages,
      loading: true,
      error: null,
    }));

    // 2. Get context (contains system prompt)
    const context = getContext(newMessages, state.currentMode);

    // 3. Send to API
    try {
      const reply = await sendMessage(content, context);

      // 4. Add AI reply
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      };

      setState((prev) => ({
        ...prev,
        messages: [...newMessages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: (error as Error).message,
      }));
    }
  };

  return (
    <div className={styles.app}>
      <ModeSelector
        modes={state.modes}
        currentMode={state.currentMode}
        onModeChange={handleModeChange}
      />
      <ChatList messages={state.messages} loading={state.loading} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
    </div>
  );
}

export default App;
```

## 3. Test Context Management

### Test Scenario 1: General Chat Mode
```
User: Hello
AI: Hello! How can I help you today?
User: What's the weather like today?
AI: I'm an AI assistant and cannot get real-time weather information. I suggest checking a weather forecast app or website.
```

### Test Scenario 2: Frontend Mentor Mode
```
User: How to learn React?
AI: I suggest the following steps for learning React:

1. **Basic Preparation**
   - Familiar with JavaScript and ES6+ syntax
   - Understand HTML and CSS basics

2. **React Core**
   - JSX syntax
   - Components and Props
   - State and Lifecycle

3. **Advanced Content**
   - Hooks (useState, useEffect, useContext)
   - React Router (routing)
   - State Management (Redux, Zustand)

Which part would you like to start learning?
```

### Test Scenario 3: Code Reviewer Mode
```
User: Help me review this code
javascript
function sum(a, b) {
  return a + b;
}
AI: This code has the following issues:

1. **Missing Parameter Type Check**: No verification if a and b are numbers
2. **Insufficient Error Handling**: No handling of possible exceptions

Improvement suggestions:
javascript
function sum(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Parameters must be numbers');
  }
  return a + b;
}


Or use TypeScript's type system for automatic handling.
```

## 4. Verification Points

- ✅ AI reply styles are significantly different in different modes
- ✅ System Prompt is correctly injected into context
- ✅ Context length is correctly controlled (General Chat 10, Frontend Mentor 15, Code Reviewer 20)
- ✅ After switching modes, new messages use new system prompt
- ✅ Old historical messages are not affected

## 5. Debugging Tips

```typescript
// Print context in sendMessage
export async function sendMessage(content: string, context: Message[]): Promise<string> {
  console.log('Context sent to API:', context);
  console.log('Context length:', context.length);

  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: false,
  };

  // ...
}
```

## 6. Performance Optimization

```typescript
// Use useMemo to cache context calculation
import { useMemo } from 'react';

function App() {
  const [state, setState] = useState<AppState>(initialState);

  // Cache context calculation
  const context = useMemo(() => {
    return getContext(state.messages, state.currentMode);
  }, [state.messages, state.currentMode]);

  // Use cached context
  const handleSend = async (content: string) => {
    // ...
    const reply = await sendMessage(content, context);
    // ...
  };
}
```

## 7. Modify src/services/chat.ts

### Current Issues

The existing `sendMessage` function has the following issues:

```typescript
// Current implementation
export async function sendMessage(content: string): Promise<string> {
  const request: OllamaChatRequest = {
    messages: [
      {
        role: "user",
        content,  // ← Only sends single message
      },
    ],
    model: "qwen2.5-coder:7b",
    stream: false,
  };
  // ...
}
```

**Issues**:
1. ❌ Only accepts content parameter, doesn't accept context
2. ❌ Only sends single message, doesn't include conversation history
3. ❌ Doesn't use system prompt, can't control AI role
4. ❌ No streaming output, waits for complete response before displaying

### Required Changes

#### Change 1: Modify sendMessage Function Signature

```typescript
// Before
export async function sendMessage(content: string): Promise<string>

// After
export async function sendMessage(
  content: string,
  context: Message[]
): Promise<string>
```

#### Change 2: Use context Parameter

```typescript
export async function sendMessage(
  content: string,
  context: Message[]
): Promise<string> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({  // ← Use context instead of only sending single message
      role: msg.role,
      content: msg.content,
    })),
    stream: false,
  };

  // ... rest of code remains the same
}
```

#### Change 3: Complete Modified Code

```typescript
import type { OllamaChatRequest, OllamaChatResponse, Message } from "../types";

// API Configuration
const API_BASE_URL = "http://localhost:11434/api";

/**
 * Send message to Ollama API
 * @param content - User message content (deprecated, kept for backward compatibility)
 * @param context - Context message array (contains system prompt and historical messages)
 * @returns AI reply content
 */
export async function sendMessage(
  content: string,
  context: Message[]
): Promise<string> {
  const request: OllamaChatRequest = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: false,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OllamaChatResponse = await response.json();
    return data.message.content;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
```

### Notes

⚠️ **content parameter is deprecated**: Although the `content` parameter is kept for backward compatibility, the actual use is with the `context` parameter. In future streaming versions, this parameter may be completely removed.

## Your Task

1. Update `src/services/chat.ts` to make sendMessage accept context parameter
2. Update `src/App.tsx` to use getContext in handleSend
3. Test different mode reply styles
4. Verify context length control

When done, tell me: "I'm done, please check @src/App.tsx"
