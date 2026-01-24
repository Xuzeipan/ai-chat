import type { OllamaChatRequest, OllamaChatResponse } from "../types";

// API 配置
const API_BASE_URL = "http://localhost:11434/api";

// 发送消息
export async function sendMessage(content: string): Promise<string> {
  const request: OllamaChatRequest = {
    messages: [
      {
        role: "user",
        content,
      },
    ],
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
