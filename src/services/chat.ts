import type {
  OllamaChatRequest,
  OllamaChatResponse,
  Message,
  StreamChunk,
} from "../types";

// API 配置
const API_BASE_URL = "http://localhost:11434/api";

// 发送消息
export async function sendMessage(
  // content: string,
  context: Message[],
): Promise<string> {
  const request: OllamaChatRequest = {
    messages: context.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    model: "qwen2.5-coder:7b",
    stream: false,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 如果需要认证，添加 token
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OllamaChatResponse = await response.json();

    return data.message.content;
  } catch (error) {
    console.error("API 请求失败：", error);
    throw error;
  }
}

/**
 * 流式发送消息到 Ollama API
 * @param context - 上下文消息数组
 * @param onChunk - 接收到新内容时的回调
 * @param onComplete - 流式输出完成时的回调
 * @param onError - 发生错误时的回调
 */
export async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
): Promise<void> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: true, // 启用流式输出
  };

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onComplete();
        break;
      }

      // 解码数据块
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim());

      // 逐行解析 JSON
      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line);

          if (data.message?.content) {
            // 实时回调新内容
            onChunk(data.message.content);
          }

          if (data.done) {
            onComplete();
            return;
          }
        } catch (e) {
          console.error("Error parsing chunk:", e);
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
