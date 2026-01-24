import styles from "./ChatInput.module.css";
import type { ChatInputProps } from "../types";
import type { KeyboardEvent } from "react";
import { useState } from "react";

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput(""); // 发送后清空输入框
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 按 Enter 发送，Shift+Enter 换行
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? "发送中..." : "发送"}
      </button>
    </div>
  );
}
