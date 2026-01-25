# ChatInput Component Example

## 1. Component Features
- Text input field
- Send button
- Handle Enter key to send
- Disable input during loading
- Empty content cannot be sent

## 2. Component File: src/components/ChatInput.tsx

```typescript
import { useState, KeyboardEvent } from 'react';
import type { ChatInputProps } from '../types';
import styles from './ChatInput.module.css';

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');  // Clear input after sending
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Press Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Prevent default newline behavior
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a message..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
```

## 3. Style File: src/components/ChatInput.module.css

```css
.chatInput {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
}

.textarea:focus {
  border-color: #007aff;
}

.textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.sendButton {
  padding: 0 24px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 44px;
  align-self: flex-end;
}

.sendButton:hover:not(:disabled) {
  background-color: #0056b3;
}

.sendButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

## 4. Code Explanation

### useState for Input Management
```typescript
const [input, setInput] = useState('');
```
- `input` stores current input content
- `setInput` updates input content

### Controlled Component
```typescript
<textarea
  value={input}                    // Bind state
  onChange={(e) => setInput(e.target.value)}  // Update state
/>
```
- React recommends using controlled components
- Value controlled by React state
- Update state on change

### Keyboard Event Handling
```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();  // Prevent newline
    handleSend();        // Send message
  }
};
```
- `e.key` checks which key was pressed
- `e.shiftKey` detects Shift key
- `e.preventDefault()` prevents default behavior

### Disable Logic
```typescript
disabled={!input.trim() || isLoading}
```
- Disabled when content is empty
- Disabled during loading
- `trim()` removes leading/trailing whitespace

### Clear After Send
```typescript
setInput('');  // Clear input box
```
- Clear after successful send
- Prepare for next input

## 5. New Concept: Controlled Components

### What are Controlled Components
- Form element values controlled by React state
- User input updates state through events
- React becomes the "single source of truth"

### Controlled vs Uncontrolled
```typescript
// Controlled component (recommended)
<input value={input} onChange={e => setInput(e.target.value)} />

// Uncontrolled component (not recommended)
<input defaultValue={input} />
```

### Why Use Controlled Components
1. Clear data flow
2. Easy to validate and format
3. Can respond to input changes in real-time

## 6. Usage Example

```typescript
import { ChatInput } from './components/ChatInput';

function App() {
  const handleSend = (content: string) => {
    console.log('Sending:', content);
  };

  return (
    <ChatInput
      onSend={handleSend}
      isLoading={false}
    />
  );
}
```

## 7. Advanced Optimization (Optional)

### Auto-adjust Height
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [input]);
```

### Character Count
```typescript
<div className={styles.charCount}>
  {input.length} / 500
</div>
```

### Shortcut Hint
```css
.sendButton::after {
  content: ' (Enter)';
  font-size: 12px;
  opacity: 0.7;
}
```

## Your Task

Based on the example, create the following files:
1. `src/components/ChatInput.tsx`
2. `src/components/ChatInput.module.css`

When done, tell me and I'll help you check!
