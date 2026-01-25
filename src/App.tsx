import { useState } from "react";
import type { Mode, AppState } from "./types";
import styles from "./App.module.css";
import MODES from "./config/modes";
import { sendMessage } from "./services/chat";
import { ChatList } from "./components/ChatList/ChatList";
import { ChatInput } from "./components/ChatInput/ChatInput";
import { ModeSelector } from "./components/ModeSelector/ModeSelector";

function App() {
  const [state, setState] = useState<Omit<AppState, "modes">>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0], // 默认模式
  });

  // 模式切换处理
  const handleModeChange = (mode: Mode) => {
    if (mode.id === state.currentMode.id) return;

    setState((prev) => ({
      ...prev,
      currentMode: mode,
    }));
  };

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
      <div className={styles.header}>
        {/* 模式选择器 */}
        <ModeSelector
          modes={MODES}
          currentMode={state.currentMode}
          onModeChange={handleModeChange}
        />
        <div className={styles.currentModeInfo}>
          当前模式: {state.currentMode.name}
        </div>
      </div>

      {/* 错误提示 */}
      {state.error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorMessage}>{state.error}</span>
          <button
            className={styles.errorClose}
            onClick={() => setState((prev) => ({ ...prev, error: null }))}
          >
            ✕
          </button>
        </div>
      )}

      {/* 聊天 */}
      <ChatList messages={state.messages} isLoading={state.loading} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
    </div>
  );
}

export default App;
