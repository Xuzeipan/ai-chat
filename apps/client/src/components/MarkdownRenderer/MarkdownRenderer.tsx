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
