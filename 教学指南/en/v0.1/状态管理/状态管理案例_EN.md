# State Management Example

## 1. What is State Management?

**State**: Data that can change within a component
**State Management**: How to manage and update this data

### Simple Understanding
- State = Component's "memory"
- State change = Component re-renders
- State management = Control how data changes

## 2. App Component State Management

### File: src/App.tsx

```typescript
import { useState } from 'react';
import type { ChatState } from './types';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import styles from './App.module.css';

function App() {
  // Manage chat state
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  // Send message handler
  const handleSend = async (content: string) => {
    // 1. Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }));

    // 2. Simulate API request (will replace with real request later)
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate AI reply
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `You said: ${content}`,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Send failed, please try again',
      }));
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>AI Chat</div>
      <ChatList messages={state.messages} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
    </div>
  );
}

export default App;
```

## 3. Style File: src/App.module.css

```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}
```

## 4. Code Explanation

### useState Basics
```typescript
const [state, setState] = useState<ChatState>({
  messages: [],
  loading: false,
  error: null,
});
```
- `state`: Current state value
- `setState`: Function to update state
- `useState<ChatState>`: Specify state type

### Functional Updates
```typescript
setState((prev) => ({
  ...prev,
  messages: [...prev.messages, newMessage],
}));
```
- Use functional updates to ensure based on latest state
- `...prev` spread old state
- Only modify properties that need to change

### Asynchronous Operation Flow
```typescript
const handleSend = async (content: string) => {
  // 1. Update state: add user message, show loading
  setState((prev) => ({ ...prev, messages: [...prev.messages, userMessage], loading: true }));

  // 2. Send request
  const response = await fetch('/api/chat');

  // 3. Update state: add AI reply, hide loading
  setState((prev) => ({ ...prev, messages: [...prev.messages, assistantMessage], loading: false }));
};
```

### Error Handling
```typescript
try {
  // Try to send request
  await sendMessage(content);
} catch (error) {
  // Catch error, update state
  setState((prev) => ({ ...prev, loading: false, error: 'Send failed' }));
}
```

## 5. State Update Patterns

### Pattern 1: Direct Update
```typescript
// Suitable for simple state
const [count, setCount] = useState(0);
setCount(count + 1);
```

### Pattern 2: Functional Update
```typescript
// Use when depending on previous state
const [messages, setMessages] = useState([]);
setMessages((prev) => [...prev, newMessage]);
```

### Pattern 3: Partial Update
```typescript
// Partial update for object state
const [state, setState] = useState({ a: 1, b: 2 });
setState((prev) => ({ ...prev, b: 3 }));  // Only update b
```

## 6. State vs Props

| Feature | State | Props |
|---------|-------|-------|
| Source | Internal to component | Passed from parent |
| Mutability | Can be modified | Read-only |
| Scope | Current component | Parent-child communication |
| Use | Internal component data | Data transfer between components |

## 7. State Design Principles

### 1. Minimize State
```typescript
// ❌ Bad practice: Redundant state
const [firstName, setFirstName] = useState('Zhang');
const [lastName, setLastName] = useState('San');
const [fullName, setFullName] = useState('Zhang San');

// ✅ Good practice: Derived state
const [firstName, setFirstName] = useState('Zhang');
const [lastName, setLastName] = useState('San');
const fullName = `${firstName}${lastName}`;  // Calculated
```

### 2. Merge Related State
```typescript
// ❌ Bad practice: Scattered state
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// ✅ Good practice: Merge related state
const [chatState, setChatState] = useState({
  messages: [],
  loading: false,
  error: null,
});
```

### 3. Single Source of Truth
```typescript
// ✅ State should be at the lowest level component that needs it
function App() {
  const [messages, setMessages] = useState([]);
  return <ChatList messages={messages} />;
}
```

## 8. Debugging Tips

### Use useEffect to Listen for State Changes
```typescript
useEffect(() => {
  console.log('State change:', state);
}, [state]);
```

### Use React DevTools
- Install React DevTools browser extension
- View Props and State
- Track state change history

## 9. Your Task

1. Modify `src/App.tsx` to implement state management
2. Create `src/App.module.css` to add styles
3. Test: Enter message, check if it displays normally

When done, tell me and I'll help you check!

## 10. Next Step Preview

After completing state management, next step is **Step 4: API Integration**, replacing simulated requests with real API calls.
