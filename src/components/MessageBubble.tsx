import type { Message } from "../types";
import styles from "./MessageBubble.module.css";

// 定义 Props 接口
interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  // const isUser = message.role === "user";

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>{message.content}</div>
    </div>
  );
}
