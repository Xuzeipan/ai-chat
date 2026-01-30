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

// 表格 - 使用 daisyui table 组件
renderer.table = (token) => {
  // header 是 TableCell[]，需要提取 text
  const headerHtml = token.header
    .map((cell) => `<th>${cell.text}</th>`)
    .join("");

  // rows 是 TableCell[][]，需要提取 text
  const rowsHtml = token.rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell.text}</td>`).join("")}</tr>`,
    )
    .join("");

  return `
    <div class="overflow-x-auto my-4">
      <table class="table w-full bg-base-200">
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
