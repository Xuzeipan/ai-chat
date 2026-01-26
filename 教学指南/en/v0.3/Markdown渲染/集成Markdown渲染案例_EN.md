# Integrating Markdown Rendering

## Basic Implementation

### 1. Modify MessageBubble Component

Integrate MarkdownRenderer in `MessageBubble.tsx`:

```typescript
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant} ${
        isSystem ? styles.system : ""
      }`}
    >
      <div className={styles.content}>
        {isSystem ? (
          // System messages displayed as tips
          <div className={styles.systemTip}>{message.content}</div>
        ) : isUser ? (
          // User messages displayed as plain text
          <span className={styles.userText}>{message.content}</span>
        ) : (
          // AI messages use Markdown rendering
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
```

### 2. Add System Message Styles (Optional)

Add in `MessageBubble.module.css`:

```css
.system {
  opacity: 0.8;
}

.systemTip {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  padding: 8px 12px;
  background-color: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}
```

### 3. Test Rendering Effects

Try sending the following Markdown content to test:

````markdown
# This is a Heading

This is a paragraph of plain text.

## Code Example

```typescript
function hello() {
  console.log("Hello, World!");
}
```

## List

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

## Table

| Name | Age | City |
|------|-----|------|
| 张三 | 25  | 北京 |
| 李四 | 30  | 上海 |

> This is a blockquote

[Link Text](https://example.com)
````

## Principle Explanation

1. **Conditional Rendering** - Determine display method based on `message.role`
2. **Style Isolation** - CSS Modules ensures styles don't conflict
3. **Component Reuse** - MarkdownRenderer can be used in multiple places

## FAQ

### Q: Code highlighting not working?

A: Make sure to import highlight.js style file:
```typescript
import "highlight.js/styles/github-dark.css";
```

### Q: Markdown content showing garbled?

A: Check if `marked.parse()` returns a string, may need type conversion.

### Q: XSS security concerns?

A: You can add DOMPurify for sanitization:
```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

```typescript
import DOMPurify from "dompurify";

// In component
const sanitizedHtml = DOMPurify.sanitize(rawHtml);
```

## Your Task

1. Modify `MessageBubble.tsx` and integrate MarkdownRenderer
2. Add necessary styles
3. Test Markdown rendering effects
4. Test code highlighting
5. Test tables, lists, quotes, and other features
