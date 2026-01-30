import type { Message } from "../../types";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

// 定义 Props 接口
interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`chat ${isUser ? "chat-end" : "chat-start"} animate-fade-in`}
    >
      <div
        className={`chat-bubble ${isUser ? "chat-bubble-primary" : "chat-bubble-accent"}`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>

    // <div className={`${styles.message} ${styles[message.role]}`}>
    //   <div className={styles.bubble}>
    //     {isUser ? (
    //       // 用户消息直接显示文本
    //       <span>{message.content}</span>
    //     ) : (
    //       // AI 消息使用 Markdown 渲染
    //       <MarkdownRenderer content={message.content} />
    //     )}
    //   </div>
    // </div>
  );
}
