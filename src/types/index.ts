type MessageRole = "user" | "assistant";

// 消息接口
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

type ChatStateError = string | null;

// 聊天状态
export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: ChatStateError;
}

// 聊天组件的输入Props
export interface ChatInputProps {
  onSend: (content: string) => void; // 建议用 onSend 而不是 send，更符合 React 命名习惯
  isLoading: boolean;
}

// API 请求类型（备用）
export interface ChatRequest {
  prompt: string;
  model?: string; // ?: 表示可选，不是必须
  temperature?: number;
  stream?: boolean;
}

// API 响应类型（备用）
export interface ChatResponse {
  success: boolean;
  data: {
    reply: string;
  };
  error?: string;
}

// Ollama 聊天请求
export interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

// Ollama 聊天响应
export interface OllamaChatResponse {
  model: string;
  message: {
    role: "assistant";
    content: string;
  };
  done: boolean;
}

// 模式类型
export interface Mode {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  contextLength: number;
  icon?: string;
}

// 流式响应的数据块类型
export interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;
  };
}

// 应用状态
export interface AppState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentMode: Mode;
  modes: Mode[];
}
