# ChatList Component Example

## 1. Component Features
- Receive message list array
- Iterate to render multiple MessageBubble components
- Auto-scroll to latest message

## 2. Component File: src/components/ChatList.tsx

```typescript
import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import styles from './ChatList.module.css';

interface ChatListProps {
  messages: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when message list changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatList} ref={listRef}>
      {messages.length === 0 ? (
        <div className={styles.empty}>No messages yet</div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
}
```

## 3. Style File: src/components/ChatList.module.css

```css
.chatList {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  scroll-behavior: smooth;
}

/* Custom scrollbar styles */
.chatList::-webkit-scrollbar {
  width: 6px;
}

.chatList::-webkit-scrollbar-track {
  background: transparent;
}

.chatList::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.chatList::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}
```

## 4. Code Explanation

### useRef Usage
```typescript
const listRef = useRef<HTMLDivElement>(null);
```
- `useRef` creates a mutable ref object that persists across renders
- `HTMLDivElement` specifies the DOM element type the ref references
- `null` is the initial value

### Auto-scroll Logic
```typescript
useEffect(() => {
  if (listRef.current) {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
}, [messages]);
```
- `useEffect` listens for `messages` changes
- `listRef.current` gets the DOM element
- `scrollTop` sets the scroll position
- `scrollHeight` gets the total content height
- Dependency array `[messages]` ensures execution when messages change

### Conditional Rendering
```typescript
{messages.length === 0 ? (
  <div className={styles.empty}>No messages yet</div>
) : (
  messages.map((message) => (
    <MessageBubble key={message.id} message={message} />
  ))
)}
```
- Empty state shows prompt
- Messages render when available

### key Attribute
```typescript
<MessageBubble key={message.id} message={message} />
```
- `key` helps React identify which elements changed
- Must use unique and stable value (like `id`)
- Don't use array index as key

## 5. New Concepts: useRef and useEffect

### useRef
- Creates a reference that persists throughout component lifecycle
- Doesn't trigger re-renders
- Commonly used for:
  - Accessing DOM elements
  - Storing timer IDs
  - Storing previous values

### useEffect
- Handles side effects (like DOM operations, network requests)
- Dependency array determines when to execute:
  - `[]` - Execute only once when component mounts
  - `[messages]` - Execute when messages change
  - Omit - Execute on every render

## 6. Usage Example

```typescript
import { ChatList } from './components/ChatList';

function App() {
  const messages: Message[] = [
    { id: '1', role: 'user', content: 'Hello' },
    { id: '2', role: 'assistant', content: 'Hello! How can I help you?' }
  ];

  return <ChatList messages={messages} />;
}
```

## 7. Advanced Optimization (Optional)

### Add Loading Indicator
```typescript
interface ChatListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatList({ messages, isLoading = false }: ChatListProps) {
  return (
    <div className={styles.chatList} ref={listRef}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <div className={styles.loading}>AI is thinking...</div>}
    </div>
  );
}
```

### Smooth Scroll Optimization
```css
.chatList {
  scroll-behavior: smooth;  /* Smooth scrolling */
}
```

## Your Task

Based on the example, create the following files:
1. `src/components/ChatList.tsx`
2. `src/components/ChatList.module.css`

When done, tell me and I'll help you check!
