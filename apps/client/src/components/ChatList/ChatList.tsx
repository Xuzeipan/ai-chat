import { useEffect, useRef } from "react";
import type { Message } from "../../types";
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
    <div
      className="flex-1 overflow-y-auto py-4 scroll-smooth bg-base-100"
      ref={listRef}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-base-content/50">
          <span className="text-5xl mb-3 opacity-50">💬</span>
          <span>暂无消息</span>
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
              <span className="animate-pulse">AI 正在思考...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
