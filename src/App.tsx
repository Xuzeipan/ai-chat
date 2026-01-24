import { useState } from "react";
import type { ChatState } from "./types";
import { ChatList } from "./components/ChatList";
import { ChatInput } from "./components/ChatInput";
import styles from "./App.module.css";
import { sendMessage } from "./services/chat";

function App() {
  // 管理聊天状态
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  // 发送消息处理函数
  const handleSend = async (content: string) => {
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
    }));

    // 2.调用 Ollama API
    try {
      const reply = await sendMessage(content);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: reply,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "发送失败，请重试",
      }));
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>AI 聊天</div>
      <ChatList messages={state.messages} isLoading={state.loading} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
      {state.error && <div className={styles.error}>{state.error}</div>}
    </div>
  );
}

export default App;
