# Component Refactoring Example - ChatInput

Using ChatInput as an example to demonstrate how to refactor CSS Modules to Tailwind CSS + daisyUI.

## Before (CSS Modules Version)

### ChatInput.tsx
```typescript
import { useState } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter message..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className={`${styles.button} ${isLoading ? styles.loading : ''}`}
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
```

### ChatInput.module.css
```css
.container {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  min-height: 44px;
  max-height: 120px;
}

.textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.textarea:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

.button {
  padding: 12px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.button:hover:not(:disabled) {
  background: #40a9ff;
}

.button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.loading {
  opacity: 0.7;
}
```

## After (Tailwind + daisyUI Version)

### ChatInput.tsx
```typescript
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-base-200 border-t border-base-300">
      <textarea
        className="textarea textarea-bordered flex-1 min-h-[44px] max-h-[120px] resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter message..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className="btn btn-primary min-w-[80px]"
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Sending
          </>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
}
```

### Delete File
- `ChatInput.module.css` (no longer needed)

## Class Name Comparison

| Original CSS Modules | Tailwind + daisyUI | Description |
|---------------------|-------------------|-------------|
| `display: flex` | `flex` | Flex layout |
| `gap: 12px` | `gap-3` | 12px spacing (1 unit = 4px) |
| `padding: 16px` | `p-4` | 16px padding |
| `flex: 1` | `flex-1` | Take remaining space |
| `background: #f5f5f5` | `bg-base-200` | Secondary background (theme adaptive) |
| `border-top: 1px solid #e0e0e0` | `border-t border-base-300` | Top border (theme adaptive) |
| `padding: 12px 24px` | `btn` | daisyUI button base class |
| `background: #1890ff` | `btn-primary` | Primary color button |
| `border-radius: 8px` | `rounded-lg` or built-in | Border radius |
| `cursor: not-allowed` | Auto-handled by component | Disabled state style |
| `resize: none` | `resize-none` | Disable resize |
| `min-height: 44px` | `min-h-[44px]` | Arbitrary value in brackets |
| `max-height: 120px` | `max-h-[120px]` | Arbitrary value in brackets |

## Common daisyUI Component Classes

### Buttons
```tsx
// Basic button
<button className="btn">Default</button>

// Primary button
<button className="btn btn-primary">Primary</button>

// Secondary button
<button className="btn btn-secondary">Secondary</button>

// Ghost button (transparent background)
<button className="btn btn-ghost">Ghost</button>

// Circle button
<button className="btn btn-circle">+</button>

// Loading state
<button className="btn btn-primary" disabled>
  <span className="loading loading-spinner"></span>
  Loading
</button>
```

### Inputs
```tsx
// Basic input
<input className="input" placeholder="Hint" />

// Bordered input
<input className="input input-bordered" />

// Different sizes
<input className="input input-sm" />  // Small
<input className="input input-lg" />  // Large

// Textarea
<textarea className="textarea textarea-bordered" />
```

### Cards
```tsx
<div className="card bg-base-200 shadow-sm">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
    <p>Content</p>
  </div>
</div>
```

### Chat Bubbles (daisyUI specific)
```tsx
// Other's message (left)
<div className="chat chat-start">
  <div className="chat-header">Username</div>
  <div className="chat-bubble">Message content</div>
  <div className="chat-footer opacity-50">10:00</div>
</div>

// My message (right)
<div className="chat chat-end">
  <div className="chat-bubble chat-bubble-primary">Message content</div>
</div>
```

## Tailwind Utility Classes Quick Reference

### Layout
```
flex          → display: flex
grid          → display: grid
block         → display: block
hidden        → display: none

flex-1        → flex: 1
flex-none     → flex: none

gap-2         → gap: 0.5rem (8px)
gap-4         → gap: 1rem (16px)

justify-center    → justify-content: center
items-center      → align-items: center
```

### Spacing
```
p-4           → padding: 1rem (16px)
px-4          → padding-left/right: 1rem
py-2          → padding-top/bottom: 0.5rem
pt-4          → padding-top: 1rem

m-4           → margin: 1rem
mx-auto       → margin-left/right: auto
mb-2          → margin-bottom: 0.5rem
```

### Sizing
```
w-full        → width: 100%
w-64          → width: 16rem (256px)
w-[100px]     → width: 100px (arbitrary value)

h-screen      → height: 100vh
min-h-[44px]  → min-height: 44px
max-w-md      → max-width: 28rem (448px)
```

### Background & Borders
```
bg-base-100       → Primary background color
text-base-content → Primary text color

rounded-lg        → border-radius: 0.5rem
rounded-full      → border-radius: 9999px

shadow-sm         → Small shadow
shadow-md         → Medium shadow
```

## Principle Explanation

### Why Replace CSS Modules with Tailwind?

1. **Development Efficiency**: No need to switch between CSS and TSX files
2. **Consistency**: Use design system predefined values (e.g., gap-4 is always 16px)
3. **Theme Adaptation**: `bg-base-200` automatically shows different colors in cupcake and dark themes
4. **Bundle Optimization**: Production only bundles used classes

### Relationship between daisyUI and Tailwind

- Tailwind provides low-level utility classes (layout, spacing, colors)
- daisyUI provides high-level component classes (buttons, inputs, cards)
- Both can be mixed: `className="btn btn-primary w-full mt-4"`

### Theme Adaptation Mechanism

```css
/* daisyUI uses CSS variables internally */
[data-theme="cupcake"] {
  --p: 183 47% 60%;      /* primary color */
  --pc: 0 0% 100%;       /* text on primary */
  --b1: 24 33% 97%;      /* base-100 background */
  --bc: 24 10% 10%;      /* base-content text */
}

[data-theme="dark"] {
  --p: 262 80% 50%;
  --pc: 0 0% 100%;
  --b1: 220 14% 10%;
  --bc: 220 14% 90%;
}
```

When using `bg-base-200`, it actually applies the `--b2` variable, which has different values in different themes.

## Your Tasks

1. **Refactor ChatInput Component**:
   - Replace original ChatInput.tsx with the refactored code above
   - Delete ChatInput.module.css
   - Verify styles and interactions work correctly

2. **Understand Refactoring Logic**:
   - Refer to "Class Name Comparison" to understand each class's purpose
   - Try modifying some classes to see effect changes

3. **Prepare for Subsequent Refactoring**:
   - Check other components' CSS Modules (MessageBubble, ChatList, ModeSelector)
   - Think about how to replace with Tailwind + daisyUI

When done, tell me: "I'm done, please check @apps/client/src/components/ChatInput/ChatInput.tsx"

Note: If styles look broken after refactoring, it may be because index.css hasn't been configured yet. Complete the configuration steps in "Installation and Configuration Example" first.
