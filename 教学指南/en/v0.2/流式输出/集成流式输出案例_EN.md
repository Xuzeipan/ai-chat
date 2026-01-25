# Integrate Streaming Output Example

## 1. Complete App Component Implementation

```typescript
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { Message, Mode } from './types';
import { sendMessageStream } from './services/chat';
import getContext from './utils/context';
import MODES from './config/modes';
import styles from './App.module.css';

interface AppState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentMode: Mode;
  modes: Mode[];
}

function App() {
  const [state, setState] = useState<AppState>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0],
    modes: MODES,
  });

  // Mode switching handler
  const handleModeChange = (mode: Mode) => {
    setState((prev) => ({
      ...prev,
      currentMode: mode,
    }));
  };

  // Send message handler
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

    // 2. Create empty AI message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    setState((prev) => ({
      ...prev,
      messages: [...newMessages, assistantMessage],
    }));

    // 3. Get context (contains system prompt)
    const context = getContext(newMessages, state.currentMode);

    // 4. Stream to model
    try {
      await sendMessageStream(
        context,
        // onChunk: Update message when new content received
        (newContent: string) => {
          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + newContent }
                : msg
            ),
          }));
        },
        // onComplete: Streaming output complete
        () => {
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        },
        // onError: Error handling
        (error: Error) => {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
          }));
        }
      );
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: (error as Error).message,
      }));
    }
  };

  // Clear error
  const handleClearError = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  return (
    <div className={styles.app}>
      {/* Mode Selector */}
      <ModeSelector
        modes={state.modes}
        currentMode={state.currentMode}
        onModeChange={handleModeChange}
      />

      {/* Error Banner */}
      {state.error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorMessage}>{state.error}</span>
          <button
            className={styles.errorClose}
            onClick={handleClearError}
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat List */}
      <ChatList
        messages={state.messages}
        loading={state.loading}
      />

      {/* Input Box */}
      <ChatInput
        onSend={handleSend}
        isLoading={state.loading}
      />
    </div>
  );
}

export default App;
```

## 2. Streaming Output State Management Key Points

### 2.1 Create Message Placeholder

```typescript
// At the start of streaming output, create an empty message placeholder
const assistantMessageId = (Date.now() + 1).toString();
const assistantMessage: Message = {
  id: assistantMessageId,
  role: 'assistant',
  content: '',  // Initially empty
};

// Add to message list
setState(prev => ({
  ...prev,
  messages: [...newMessages, assistantMessage],
}));
```

### 2.2 Update Message Content Word by Word

```typescript
// In onChunk callback, update message content word by word
onChunk: (newContent: string) => {
  setState(prev => ({
    ...prev,
    messages: prev.messages.map(msg =>
      msg.id === assistantMessageId
        ? { ...msg, content: msg.content + newContent }  // Append new content
        : msg
    ),
  }));
}
```

### 2.3 Update Loading State on Complete

```typescript
// In onComplete callback, turn off loading state
onComplete: () => {
  setState(prev => ({
    ...prev,
    loading: false,
  }));
}
```

## 3. Test Streaming Output

### Test Scenario 1: Long Text Output

```
User: Write a quick sort algorithm

AI Reply (streaming display):
Quick → Quick Sor → Quick Sort → Quick Sort ( → Quick Sort (Quick → Quick Sort (QuickSo → ...)
```

### Test Scenario 2: Code Block Output

```
User: Write a React component

AI Reply (streaming display):
``` → ```java → ```javasc → ```javascri → ```javascrip → ```javascrip → ...

function MyComponent() {
  return <div>Hello</div>;
}
```
```

### Test Scenario 3: Network Interruption

```
1. Start sending message
2. Disconnect network halfway
3. Verify error prompt displays correctly
4. Verify can continue sending new messages
```

## 4. Verification Points

- ✅ Streaming output displays in real-time with typewriter effect
- ✅ Message content appends word by word, no duplication
- ✅ After streaming output completes, message displays completely
- ✅ Loading state remains true during streaming output
- ✅ After streaming output completes, loading state becomes false
- ✅ Error displays error prompt, doesn't affect subsequent use
- ✅ Can correctly handle errors when network is interrupted

## 5. Performance Optimization

```typescript
// Use useMemo to optimize context calculation
import { useMemo } from 'react';

function App() {
  const [state, setState] = useState<AppState>(initialState);

  // Cache context calculation
  const context = useMemo(() => {
    return getContext([...state.messages, userMessage], state.currentMode);
  }, [state.messages, state.currentMode]);

  // Use cached context
  await sendMessageStream(context, onChunk, onComplete, onError);
}
```

```typescript
// Limit update frequency (use debounce)
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let lastCall = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
}

// Use in onChunk
const throttledOnChunk = throttle((content: string) => {
  setState(prev => ({
    ...prev,
    messages: prev.messages.map(msg =>
      msg.id === assistantMessageId
        ? { ...msg, content: msg.content + content }
        : msg
    ),
  }));
}, 50);  // Update at most every 50ms
```

## 6. Debugging Tips

```typescript
// Add debug logs
const handleSend = async (content: string) => {
  console.log('Start sending message:', content);
  console.time('stream');

  await sendMessageStream(
    context,
    (newContent) => {
      console.log('Received content chunk:', newContent);
      // Update state...
    },
    () => {
      console.timeEnd('stream');
      console.log('Streaming output complete');
      // Complete processing...
    },
    (error) => {
      console.error('Streaming output error:', error);
      // Error handling...
    }
  );
};
```

## Your Task

1. Update `src/App.tsx` to integrate streaming output
2. Implement streaming output state update logic
3. Test streaming output real-time and stability
4. Verify error handling

When done, tell me: "I'm done, please check @src/App.tsx"
