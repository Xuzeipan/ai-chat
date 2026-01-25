import { useState } from "react";
import type { Mode, AppState, Message } from "./types";
import styles from "./App.module.css";
import MODES from "./config/modes";
import { sendMessageStream } from "./services/chat";
import { ChatList } from "./components/ChatList/ChatList";
import { ChatInput } from "./components/ChatInput/ChatInput";
import { ModeSelector } from "./components/ModeSelector/ModeSelector";
import getContext from "./utils/context";

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

    const newMessages = [...state.messages, userMessage];
    setState((prev) => ({
      ...prev,
      messages: newMessages,
      loading: true,
    }));

    // 创建空的 AI 消息占位符
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setState((prev) => ({
      ...prev,
      messages: [...newMessages, assistantMessage],
    }));

    // 获取上下文
    const context = getContext(newMessages, state.currentMode);

    // 调用 Ollama API
    try {
      await sendMessageStream(
        context,
        // onChunk: 接收到新内容时更新消息
        (newContent: string) => {
          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + newContent }
                : msg,
            ),
            loading: false,
          }));
        },
        // onComplete: 流式输出完成
        () => {
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        },
        // onError: 错误处理
        (error: Error) => {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
          }));
        },
      );
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "发送失败，请重试",
      }));
    }
  };
  // 清除错误
  const handleClearError = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
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
          <button className={styles.errorClose} onClick={handleClearError}>
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
