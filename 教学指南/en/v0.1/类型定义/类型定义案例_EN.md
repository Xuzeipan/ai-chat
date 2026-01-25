# TypeScript Type Definition Example

## 1. Basic Interface Definition

```typescript
// Define message type
interface Message {
  id: string;           // Message unique identifier
  role: 'user' | 'assistant';  // Message role
  content: string;      // Message content
  timestamp: number;    // Timestamp
}

// Define application state
interface ChatState {
  messages: Message[];  // Message list
  isLoading: boolean;   // Whether loading
  error: string | null; // Error message
}
```

## 2. Component Props Types

```typescript
// Props for chat list component
interface ChatListProps {
  messages: Message[];  // Incoming message list
}

// Props for input component
interface ChatInputProps {
  onSend: (content: string) => void;  // Send callback function
  isLoading: boolean;                 // Whether sending
}
```

## 3. Function Types

```typescript
// Function type for sending messages
type SendMessageFn = (content: string) => Promise<void>;

// API response type
interface ApiResponse {
  success: boolean;
  data: {
    reply: string;
  };
  error?: string;
}
```

## 4. Type Alias vs Interface

```typescript
// Type alias - suitable for union types, tuples, etc.
type MessageRole = 'user' | 'assistant';
type MessageId = string;

// Interface - suitable for object structures
interface Message {
  id: MessageId;
  role: MessageRole;
  content: string;
}
```

## 5. Practical Usage Example

```typescript
// Usage in component
import { useState } from 'react';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const handleSend: SendMessageFn = async (content) => {
    // Send logic
  };

  return (
    <div>
      <ChatList messages={state.messages} />
      <ChatInput onSend={handleSend} isLoading={state.isLoading} />
    </div>
  );
}
```

## 6. Optional and Readonly Properties

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;      // Optional property
  readonly createdAt: Date; // Readonly property
}
```

## 7. Utility Types

```typescript
// Partial property update
type UpdateMessage = Partial<Message>;

// Required properties
type CreateMessage = Required<Pick<Message, 'role' | 'content'>>;

// Extract type
type MessageRoleType = Message['role']; // 'user' | 'assistant'
```

## Your Task

Based on your project requirements, define the following types:

1. **Message Interface**: containing role and content
2. **ChatState Type**: containing messages, loading, error
3. **ChatInputProps Interface**: props needed for input component

Try it out, and I can help you check when you're done!
