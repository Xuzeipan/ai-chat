# MessageBubble Component Example

## 1. Component File: src/components/MessageBubble.tsx

```typescript
import type { Message } from '../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

## 2. Style File: src/components/MessageBubble.module.css

```css
.message {
  display: flex;
  margin-bottom: 16px;
  padding: 0 16px;
}

/* User messages align right */
.user {
  justify-content: flex-end;
}

/* AI messages align left */
.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* User message bubble */
.user .bubble {
  background-color: #007aff;
  color: white;
  border-bottom-right-radius: 4px;
}

/* AI message bubble */
.assistant .bubble {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}
```

## 3. Code Explanation

### Component Part
```typescript
// Import types and styles
import { Message } from '../types';
import styles from './MessageBubble.module.css';

// Define Props interface
interface MessageBubbleProps {
  message: Message;
}

// Component receives message as props
export function MessageBubble({ message }: MessageBubbleProps) {
  // Check if it's a user message
  const isUser = message.role === 'user';

  // Use CSS Modules
  // styles.message: base style
  // styles[message.role]: dynamically add .user or .assistant class
  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

### Style Part
```css
/* Base container */
.message {
  display: flex;        /* Use flex layout */
  margin-bottom: 16px;  /* Message spacing */
  padding: 0 16px;      /* Left and right padding */
}

/* User messages align right */
.user {
  justify-content: flex-end;  /* Flex container right align */
}

/* AI messages align left */
.assistant {
  justify-content: flex-start;  /* Flex container left align */
}

/* Bubble base style */
.bubble {
  max-width: 70%;      /* Max width 70% */
  padding: 12px 16px;  /* Padding */
  border-radius: 12px; /* Rounded corners */
  line-height: 1.5;    /* Line height */
  word-wrap: break-word; /* Long text wrap */
}

/* User bubble style */
.user .bubble {
  background-color: #007aff;      /* Blue background */
  color: white;                   /* White text */
  border-bottom-right-radius: 4px; /* Small rounded corner bottom right */
}

/* AI bubble style */
.assistant .bubble {
  background-color: #f0f0f0;      /* Gray background */
  color: #333;                    /* Dark text */
  border-bottom-left-radius: 4px;  /* Small rounded corner bottom left */
}
```

## 4. How CSS Modules Work

```typescript
// Class names in CSS file
.user { justify-content: flex-end; }

// After compilation, styles object contains hashed class names
styles.user === 'MessageBubble_user__abc123'

// Usage in JSX
<div className={styles[message.role]}>  // Dynamically get class name

// Final rendered HTML
<div class="MessageBubble_user__abc123">
```

## 5. Usage Example

```typescript
import { MessageBubble } from './components/MessageBubble';

function App() {
  const message: Message = {
    id: '1',
    role: 'user',
    content: 'Hello!'
  };

  return <MessageBubble message={message} />;
}
```

## 6. Advanced Optimization (Optional)

### Add Timestamp
```typescript
interface MessageBubbleProps {
  message: Message;
  showTime?: boolean;  // Optional: whether to show time
}

export function MessageBubble({ message, showTime = false }: MessageBubbleProps) {
  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
      {showTime && <div className={styles.time}>12:30</div>}
    </div>
  );
}
```

### Add Avatar
```typescript
export function MessageBubble({ message }: MessageBubbleProps) {
  const avatar = message.role === 'user' ? '/user.png' : '/ai.png';

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <img src={avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

## Your Task

Based on the example, create the following files:
1. `src/components/MessageBubble.tsx`
2. `src/components/MessageBubble.module.css`

When done, tell me and I'll help you check!
