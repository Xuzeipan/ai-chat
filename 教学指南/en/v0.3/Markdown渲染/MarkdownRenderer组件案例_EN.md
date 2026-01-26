# MarkdownRenderer Component Example

## Basic Implementation

### 1. Install Dependencies

```bash
pnpm add marked highlight.js
pnpm add -D @types/marked @types/highlight.js
```

### 2. Create Component File

**src/components/MarkdownRenderer/MarkdownRenderer.tsx**

```typescript
import { useMemo } from "react";
import hljs from "highlight.js";
import { marked } from "marked";
import type { MarkdownRendererProps } from "../../types";
import styles from "./MarkdownRenderer.module.css";

// Custom renderer for code block highlighting
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const language = hljs.getLanguage(lang || "") ? lang || "" : "plaintext";
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
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

**src/main.tsx** - Add highlight.js styles:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "highlight.js/styles/github-dark.css"; // Add this line
import "./index.css";
import App from "./App.tsx";
```

### 3. Create Style File

**src/components/MarkdownRenderer/MarkdownRenderer.module.css**

```css
.markdown {
  line-height: 1.6;
  font-size: 14px;
  color: #374151;
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
  color: #111827;
}

.markdown h1 {
  font-size: 1.5em;
  border-bottom: 1px solid #e5e7eb;
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

/* Blockquotes */
.markdown blockquote {
  margin: 0.8em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3b82f6;
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Code blocks */
.markdown pre {
  margin: 0.8em 0;
  padding: 1em;
  background-color: #1f2937;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown code {
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 0.9em;
}

/* Inline code */
.markdown :not(pre) > code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  color: #dc2626;
}

/* Links */
.markdown a {
  color: #3b82f6;
  text-decoration: none;
}

.markdown a:hover {
  text-decoration: underline;
}

/* Tables */
.markdown table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.8em 0;
}

.markdown th,
.markdown td {
  border: 1px solid #e5e7eb;
  padding: 0.5em 1em;
  text-align: left;
}

.markdown th {
  background-color: #f9fafb;
  font-weight: 600;
}

.markdown tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Horizontal rules */
.markdown hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
}

/* Images */
.markdown img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
```

## Usage Example

Used in `MessageBubble`:

```typescript
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.content}>
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

## Principle Explanation

1. **`marked`** - Parses Markdown text to HTML
2. **`highlight.js`** - Applies syntax highlighting to code blocks
3. **`dangerouslySetInnerHTML`** - React's way to render HTML (note XSS risks)
4. **`useMemo`** - Caches parsing results for better performance
5. **CSS Modules** - Style isolation to avoid global pollution

## Advanced Features (Optional)

1. **XSS Protection** - Use DOMPurify to sanitize HTML
2. **Image Zoom** - Show larger image on click
3. **Copy Code Button** - Add copy button at top-right of code blocks
4. **TOC Generation** - Auto-generate table of contents

## Your Task

1. Install `marked` and `highlight.js` dependencies
2. Create `src/components/MarkdownRenderer/` folder
3. Create `MarkdownRenderer.tsx` component
4. Create `MarkdownRenderer.module.css` style file
5. Integrate MarkdownRenderer into MessageBubble
