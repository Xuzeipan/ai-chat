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
  // 当消息列表发生变化时，自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatlist} ref={listRef}>
      {messages.length === 0 ? (
        <div className={styles.empty}>暂无消息</div>
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
              <span className={styles.loadingText}>AI 正在思考...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
