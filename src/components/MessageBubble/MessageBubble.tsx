import type { Message } from "../../types";
import styles from "./MessageBubble.module.css";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

// 定义 Props 接口
interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  // const isSystem = message.role === "system";

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {isUser ? (
          // 用户消息直接显示文本
          <span>{message.content}</span>
        ) : (
          // AI 消息使用 Markdown 渲染
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
    // <div
    //   className={`${styles.bubble} ${isUser ?  styles.user : styles.assistant} ${
    //     isSystem ? styles.system : ""
    //   }`}
    // >
    //   <div className={styles.content}>
    //     {isSystem ? (
    //       // 系统消息显示为提示
    //       <div className={styles.systemTip}>{message.content}</div>
    //     ) : isUser ? (
    //       // 用户消息直接显示文本
    //       <span className={styles.userText}>{message.content}</span>
    //     ) : (
    //       // AI 消息使用 Markdown 渲染
    //       <MarkdownRenderer content={message.content} />
    //     )}
    //   </div>
    // </div>
  );
}
