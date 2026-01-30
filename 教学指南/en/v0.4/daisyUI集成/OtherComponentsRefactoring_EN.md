# Other Components Refactoring Examples

Continue refactoring MessageBubble, ChatList, ModeSelector, and MarkdownRenderer components.

## 1. MessageBubble Refactoring

daisyUI has a built-in `chat` component, perfect for chat bubble scenarios.

### Before

```tsx
import type { Message } from "../../types";
import styles from "./MessageBubble.module.css";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
```

### After

```tsx
import type { Message } from "../../types";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"} animate-fade-in`}>
      <div className={`chat-bubble ${isUser ? "chat-bubble-primary" : "bg-base-200 text-base-content"}`}>
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
```

### Explanation

| Original CSS | daisyUI Class | Purpose |
|--------|-------------|------|
| `display: flex` + `justify-content: flex-end/flex-start` | `chat-start` / `chat-end` | Control bubble left/right position |
| `max-width: 70%` + `border-radius` | `chat-bubble` | Bubble style |
| `background-color: var(--primary-color)` | `chat-bubble-primary` | User message primary color |
| `background-color: var(--surface-color)` | `bg-base-200` | AI message background color |
| `@keyframes fadeIn` | `animate-fade-in` | Fade-in animation (needs configuration) |

**Delete file**: `MessageBubble.module.css`

---

## 2. ChatList Refactoring

### Before

```tsx
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import styles from "./ChatList.module.css";
import { MessageBubble } from "../MessageBubble/MessageBubble";

interface ChatListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatList({ messages, isLoading = false }: ChatListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatlist} ref={listRef}>
      {messages.length === 0 ? (
        <div className={styles.empty}>No messages</div>
      ) : (
        <>
          {messages
            .filter((msg) => msg.content)
            .map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.loadingText}>AI is thinking...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### After

```tsx
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import { MessageBubble } from "../MessageBubble/MessageBubble";

interface ChatListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatList({ messages, isLoading = false }: ChatListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto py-4 scroll-smooth bg-base-100"
      ref={listRef}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-base-content/50">
          <span className="text-5xl mb-3 opacity-50">💬</span>
          <span>No messages</span>
        </div>
      ) : (
        <div className="space-y-4 px-4">
          {messages
            .filter((msg) => msg.content)
            .map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-3 text-base-content/60 text-sm">
              <span className="loading loading-dots loading-sm"></span>
              <span className="animate-pulse">AI is thinking...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Explanation

| Original CSS | Tailwind Class | Purpose |
|--------|--------------|------|
| `flex: 1` | `flex-1` | Take remaining space |
| `overflow-y: auto` | `overflow-y-auto` | Vertical scroll |
| `padding: 16px 0` | `py-4` | Vertical padding |
| `scroll-behavior: smooth` | `scroll-smooth` | Smooth scrolling |
| `background-color: var(--background-color)` | `bg-base-100` | Background color |
| Custom loading animation | `loading loading-dots` | daisyUI loading animation |
| Custom pulse animation | `animate-pulse` | Tailwind built-in animation |

**Delete file**: `ChatList.module.css`

---

## 3. ModeSelector Refactoring

### Before

```tsx
import type { Mode } from "../../types";
import styles from "./ModeSelector.module.css";

interface ModeSelectorProps {
  modes: Mode[];
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({
  modes,
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className={styles.modeSelector}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`${styles.modeButton} ${mode.id === currentMode.id ? styles.active : ""}`}
          onClick={() => onModeChange(mode)}
          title={mode.description}
        >
          <span className={styles.modeIcon}>{mode.icon || "💬"}</span>
          <span className={styles.modeName}>{mode.name}</span>
        </button>
      ))}
    </div>
  );
}
```

### After

```tsx
import type { Mode } from "../../types";

interface ModeSelectorProps {
  modes: Mode[];
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({
  modes,
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2 px-4 py-3 bg-base-100 border-b border-base-300 overflow-x-auto">
      {modes.map((mode) => {
        const isActive = mode.id === currentMode.id;
        return (
          <button
            key={mode.id}
            className={`
              btn btn-sm gap-1.5 whitespace-nowrap
              ${isActive ? "btn-primary" : "btn-outline"}
            `}
            onClick={() => onModeChange(mode)}
            title={mode.description}
          >
            <span className="text-base">{mode.icon || "💬"}</span>
            <span className="hidden sm:inline">{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### Explanation

| Original CSS | daisyUI/Tailwind Class | Purpose |
|--------|---------------------|------|
| `display: flex` + `gap: 8px` | `flex gap-2` | Horizontal layout |
| `padding: 12px 16px` | `px-4 py-3` | Padding |
| `border-bottom` | `border-b border-base-300` | Bottom border |
| `overflow-x: auto` | `overflow-x-auto` | Horizontal scroll |
| Custom button style | `btn btn-sm` | daisyUI small button |
| `&.active` | `btn-primary` / `btn-outline` | Active/inactive state |
| `@media (max-width: 768px)` | `hidden sm:inline` | Responsive text hiding |

**Delete file**: `ModeSelector.module.css`

---

## 4. MarkdownRenderer Refactoring

### Solution: Keep code blocks as-is, use daisyUI table component for tables

Since Markdown content is inserted via `dangerouslySetInnerHTML`, we need to use marked's custom renderer to add daisyUI classes to tables.

### Step 1: Modify MarkdownRenderer.tsx

```tsx
import { useMemo } from "react";
import hljs from "highlight.js";
import { marked } from "marked";
import type { MarkdownRendererProps } from "../../types";
import styles from "./MarkdownRenderer.module.css";

// Custom renderer
const renderer = new marked.Renderer();

// Code blocks - keep highlight.js styles
renderer.code = ({ text, lang }) => {
  const language = hljs.getLanguage(lang || "") ? lang || "" : "plaintext";
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
};

// Tables - use daisyUI table component
renderer.table = (token) => {
  // header is TableCell[], need to extract text
  const headerHtml = token.header
    .map((cell) => `<th>${cell.text}</th>`)
    .join("");

  // rows is TableCell[][], need to extract text
  const rowsHtml = token.rows
    .map((row) =>
      `<tr>${row.map((cell) => `<td>${cell.text}</td>`).join("")}</tr>`
    )
    .join("");

  return `
    <div class="overflow-x-auto my-4">
      <table class="table table-zebra w-full">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
};

marked.use({ renderer });

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    return marked.parse(content) as string;
  }, [content]);

  return (
    <div
      className={`${styles.markdown} ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
```

### Step 2: Modify MarkdownRenderer.module.css

Remove table styles (handled by daisyUI table classes), keep other styles:

```css
.markdown {
  line-height: 1.6;
  font-size: 14px;
}

/* Heading styles */
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown h1 {
  font-size: 1.5em;
  border-bottom: 1px solid hsl(var(--b3));
  padding-bottom: 0.3em;
}

.markdown h2 {
  font-size: 1.25em;
}

.markdown h3 {
  font-size: 1.1em;
}

/* Paragraphs */
.markdown p {
  margin: 0.8em 0;
}

/* Lists */
.markdown ul,
.markdown ol {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.markdown li {
  margin: 0.3em 0;
}

/* Blockquotes - use daisyUI color variables */
.markdown blockquote {
  margin: 0.8em 0;
  padding: 0.75em 1em;
  border-left: 4px solid hsl(var(--p));
  background-color: hsl(var(--b2));
  border-radius: 0 var(--rounded-btn, 0.5rem) var(--rounded-btn, 0.5rem) 0;
}

/* Code blocks - keep highlight.js dark background */
.markdown pre {
  margin: 0.8em 0;
  padding: 1em;
  background-color: #1f2937;
  border-radius: var(--rounded-btn, 0.5rem);
  overflow-x: auto;
}

.markdown code {
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 0.9em;
}

/* Inline code - theme adaptive */
.markdown :not(pre) > code {
  background-color: hsl(var(--b2));
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  color: hsl(var(--p));
}

/* Links - use theme color */
.markdown a {
  color: hsl(var(--p));
  text-decoration: none;
}

.markdown a:hover {
  text-decoration: underline;
}

/* Dividers */
.markdown hr {
  border: none;
  border-top: 1px solid hsl(var(--b3));
  margin: 1.5em 0;
}

/* Images */
.markdown img {
  max-width: 100%;
  height: auto;
  border-radius: var(--rounded-btn, 0.5rem);
}

/* Table styles handled by daisyUI table classes, no need to define here */
```

### daisyUI Table Classes

| Class | Purpose |
|------|------|
| `table` | Basic table style |
| `table-zebra` | Zebra striping (alternating row colors) |
| `w-full` | 100% width |
| `overflow-x-auto` | Horizontal scroll on mobile |

### Table Rendering Effects

- **Header**: Automatically uses daisyUI theme color background
- **Zebra striping**: `table-zebra` automatically alternates row colors
- **Responsive**: `overflow-x-auto` ensures mobile scrollability
- **Borders/Rounded corners**: Built into daisyUI table component

**Keep file**: `MarkdownRenderer.module.css` (remove table styles)

---

## 5. Add Custom Animations (Optional)

If you need the `animate-fade-in` animation, add to `index.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

---

## 6. App.tsx Layout Refactoring (Fix Scrollbar Issue)

After adding navbar and ModeSelector, the total height exceeds the viewport, causing an outer scrollbar. Refactor to Flex layout to let ChatList fill remaining space.

### Before

```tsx
<>
  <header className="navbar bg-base-100 shadow-sm">...</header>
  <div className={styles.app}>
    <div className={styles.header}>
      <ModeSelector ... />
    </div>
    {state.error && <div className={styles.errorBanner}>...</div>}
    <ChatList messages={state.messages} isLoading={state.loading} />
    <ChatInput onSend={handleSend} isLoading={state.loading} />
  </div>
</>
```

### After

```tsx
<div className="h-screen flex flex-col bg-base-100">
  {/* Top navigation */}
  <header className="navbar bg-base-100 shadow-sm flex-none">
    <div className="flex-1">
      <h1 className="text-xl font-bold">AI Chat</h1>
    </div>
    <div className="flex-none gap-2">
      <ThemeToggle />
    </div>
  </header>

  {/* Mode selector */}
  <ModeSelector
    modes={MODES}
    currentMode={state.currentMode}
    onModeChange={handleModeChange}
  />

  {/* Error message */}
  {state.error && (
    <div className="alert alert-error rounded-none flex-none">
      <span>{state.error}</span>
      <button className="btn btn-ghost btn-sm" onClick={handleClearError}>
        ✕
      </button>
    </div>
  )}

  {/* Chat area - fill remaining space */}
  <ChatList messages={state.messages} isLoading={state.loading} />

  {/* Input - fixed at bottom */}
  <ChatInput onSend={handleSend} isLoading={state.loading} />
</div>
```

### Layout Explanation

| Element | Class | Purpose |
|------|------|------|
| Outer container | `h-screen flex flex-col` | Limit height to viewport, vertical Flex |
| navbar | `flex-none` | No flex shrink, fixed height |
| ModeSelector | None (own height) | No flex shrink |
| Error message | `flex-none` | No flex shrink |
| **ChatList** | `flex-1 overflow-y-auto` | **Fill remaining space, scrollable** |
| ChatInput | None (own height) | Fixed at bottom |

### Key Changes

1. **ChatList component** needs `flex-1`:
   ```tsx
   <div className="flex-1 overflow-y-auto py-4 bg-base-100" ref={listRef}>
   ```

2. **Delete** `App.module.css` (or empty it), use Tailwind exclusively

3. **Mobile adaptation**: Use `h-dvh` instead of `h-screen` to avoid mobile browser toolbar issues
   ```tsx
   <div className="h-screen h-dvh flex flex-col bg-base-100">
   ```

### Result

- Total app height = viewport height (no outer scrollbar)
- ChatList automatically calculates remaining height and scrolls internally
- Input always fixed at bottom

---

## Your Tasks

Refactor components in this order:

1. **MessageBubble** - Use daisyUI `chat` component
2. **ChatList** - Use Tailwind utility classes
3. **ModeSelector** - Use daisyUI `btn` component
4. **MarkdownRenderer** - Update CSS to use daisyUI variables

After each component, delete the corresponding `.module.css` file.

When done, tell me: "I'm done, please check @apps/client/src/components/..."
