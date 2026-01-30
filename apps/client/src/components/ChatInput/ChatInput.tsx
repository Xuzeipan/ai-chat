import type { ChatInputProps } from "../../types";
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
    <div className="flex gap-3 p-4 bg-base-200 border-t border-base-300">
      <textarea
        className="textarea textarea-bordered flex-1 min-h-11 max-h-30 resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className="btn btn-primary min-w-20"
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            发送中
          </>
        ) : (
          "发送"
        )}
      </button>
    </div>
  );
}
