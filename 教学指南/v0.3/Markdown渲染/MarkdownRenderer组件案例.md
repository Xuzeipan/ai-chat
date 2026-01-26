# MarkdownRenderer 组件案例

## 基础实现

### 1. 安装依赖

```bash
pnpm add marked highlight.js
pnpm add -D @types/marked @types/highlight.js
```

### 2. 创建组件文件

**src/components/MarkdownRenderer/MarkdownRenderer.tsx**

```typescript
import { useMemo } from "react";
import hljs from "highlight.js";
import { marked } from "marked";
import type { MarkdownRendererProps } from "../../types";
import styles from "./MarkdownRenderer.module.css";

// 自定义 renderer 处理代码块高亮
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

**src/main.tsx** - 添加 highlight.js 样式：

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "highlight.js/styles/github-dark.css"; // 添加这行
import "./index.css";
import App from "./App.tsx";
```

### 3. 创建样式文件

**src/components/MarkdownRenderer/MarkdownRenderer.module.css**

```css
.markdown {
  line-height: 1.6;
  font-size: 14px;
  color: #374151;
}

/* 标题样式 */
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

/* 段落 */
.markdown p {
  margin: 0.8em 0;
}

/* 列表 */
.markdown ul,
.markdown ol {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.markdown li {
  margin: 0.3em 0;
}

/* 引用块 */
.markdown blockquote {
  margin: 0.8em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3b82f6;
  background-color: #f3f4f6;
  color: #4b5563;
}

/* 代码块 */
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

/* 行内代码 */
.markdown :not(pre) > code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  color: #dc2626;
}

/* 链接 */
.markdown a {
  color: #3b82f6;
  text-decoration: none;
}

.markdown a:hover {
  text-decoration: underline;
}

/* 表格 */
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

/* 分割线 */
.markdown hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
}

/* 图片 */
.markdown img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
```

## 使用示例

在 `MessageBubble` 中使用：

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

## 原理解释

1. **`marked`** - 将 Markdown 文本解析为 HTML
2. **`highlight.js`** - 对代码块进行语法高亮
3. **`dangerouslySetInnerHTML`** - React 中渲染 HTML 的方式（注意 XSS 风险）
4. **`useMemo`** - 缓存解析结果，提升性能
5. **CSS Modules** - 样式隔离，避免全局污染

## 进阶功能（可选）

1. **XSS 防护** - 使用 DOMPurify 净化 HTML
2. **图片放大** - 点击图片时显示大图
3. **代码复制按钮** - 在代码块右上角添加复制按钮
4. **TOC 生成** - 自动生成目录

## 你的任务

1. 安装 `marked` 和 `highlight.js` 依赖
2. 创建 `src/components/MarkdownRenderer/` 文件夹
3. 创建 `MarkdownRenderer.tsx` 组件
4. 创建 `MarkdownRenderer.module.css` 样式文件
5. 在 MessageBubble 中集成 MarkdownRenderer
