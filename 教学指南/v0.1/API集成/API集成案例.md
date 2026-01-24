# API 集成案例

## 1. 什么是 API 集成？

**API（Application Programming Interface）**：应用程序编程接口
**API 集成**：让前端应用与后端服务通信

### 简单理解
- API = 应用之间的"桥梁"
- API 集成 = 通过这个桥梁发送请求和接收数据

## 2. 项目结构

```
src/
├── services/
│   └── chat.ts          # 聊天 API 服务
├── types/
│   └── index.ts         # API 相关类型
└── App.tsx              # 使用 API 服务
```

## 3. API 类型定义

### 文件：src/types/index.ts（添加）

```typescript
// API 请求类型
interface ChatRequest {
  message: string;
  model?: string;
  temperature?: number;
}

// API 响应类型
interface ChatResponse {
  success: boolean;
  data: {
    reply: string;
  };
  error?: string;
}

// Ollama 聊天请求
interface OllamaChatRequest {
	model: string;
	messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}>;
	stream?: boolean;
	options?: {
		temperature?: number;
		num_predict?: number;
	};
}

// Ollama 聊天响应
interface OllamaChatResponse {
	model: string;
	message: {
		role: 'assistant';
		content: string;
	};
	done: boolean;
}
```

## 4. API 服务模块

### 文件：src/services/chat.ts

```typescript
import type { ChatRequest, ChatResponse } from '../types';

// API 基础配置
const API_BASE_URL = 'https://api.example.com';  // 替换为真实 API 地址

// 发送消息到 AI
export async function sendMessage(content: string): Promise<string> {
  const request: ChatRequest = {
    message: content,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，添加 token
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || '请求失败');
    }

    return data.data.reply;
  } catch (error) {
    console.error('API 请求失败:', error);
    throw error;  // 重新抛出错误，由调用方处理
  }
}
```

## 5. 在 App 中使用 API

### 文件：src/App.tsx（修改）

```typescript
import { useState } from 'react';
import type { ChatState } from './types';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/chat';  // 导入 API 服务
import styles from './App.module.css';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  const handleSend = async (content: string) => {
    // 1. 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }));

    // 2. 调用 API
    try {
      const reply = await sendMessage(content);

      // 3. 添加 AI 回复
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: reply,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      // 4. 错误处理
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '发送失败，请重试',
      }));
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>AI 聊天</div>
      <ChatList messages={state.messages} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
      {state.error && <div className={styles.error}>{state.error}</div>}
    </div>
  );
}

export default App;
```

## 6. 代码解析

### fetch API
```typescript
const response = await fetch(url, {
  method: 'POST',              // 请求方法
  headers: {                   // 请求头
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),  // 请求体
});
```

### 响应处理
```typescript
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
```

### 错误处理
```typescript
try {
  const reply = await sendMessage(content);
  // 成功处理
} catch (error) {
  // 错误处理
  setState((prev) => ({
    ...prev,
    loading: false,
    error: error instanceof Error ? error.message : '发送失败',
  }));
}
```

## 7. 常见 HTTP 状态码

| 状态码 | 含义 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 正常处理响应 |
| 400 | 请求错误 | 检查请求参数 |
| 401 | 未认证 | 提示用户登录 |
| 403 | 无权限 | 提示权限不足 |
| 404 | 未找到 | 检查 API 地址 |
| 500 | 服务器错误 | 提示稍后重试 |

## 8. 请求拦截器（进阶）

### 创建封装的 fetch 函数

```typescript
// src/utils/request.ts

interface RequestConfig extends RequestInit {
  timeout?: number;
}

export async function request<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = 10000, ...fetchConfig } = config;

  // 创建超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

### 使用封装的请求

```typescript
import { request } from '../utils/request';

export async function sendMessage(content: string): Promise<string> {
  return await request<string>(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
    timeout: 30000,  // 30 秒超时
  });
}
```

## 9. 环境变量配置

### 创建 .env 文件
```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your-api-key
```

### 使用环境变量
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const response = await fetch(`${API_BASE_URL}/chat`, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
  },
});
```

## 10. Mock 数据（用于测试）

### 创建 Mock 服务
```typescript
// src/services/chat.mock.ts

export async function sendMessageMock(content: string): Promise<string> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟 AI 回复
  const responses = [
    `我收到了你的消息："${content}"`,
    `你说得对，"${content}" 是个很好的观点`,
    `关于"${content}"，我需要更多信息来回答`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
```

### 条件使用 Mock
```typescript
const USE_MOCK = true;  // 开发时使用 mock

export async function sendMessage(content: string): Promise<string> {
  if (USE_MOCK) {
    return sendMessageMock(content);
  }
  // 真实 API 调用
  // ...
}
```

## 11. 错误提示样式

### 文件：src/App.module.css（添加）

```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;

  .header {
    padding: 16px;
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }

  .error {
    color: #ff4444;
    padding: 12px 16px;
    background-color: #ffe6e6;
    border-radius: 8px;
    margin: 8px 16px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ffcccc;
  }
}
```

### 样式解析

```css
.error {
  color: #ff4444;              /* 红色文字 */
  padding: 12px 16px;          /* 内边距 */
  background-color: #ffe6e6;   /* 浅红色背景 */
  border-radius: 8px;          /* 圆角 */
  margin: 8px 16px;            /* 外边距 */
  text-align: center;          /* 文字居中 */
  font-size: 14px;             /* 字体大小 */
  border: 1px solid #ffcccc;   /* 边框 */
}
```

### 显示效果

当 API 请求失败时，错误提示会显示在输入框上方：

```
┌─────────────────────────────┐
│         AI 聊天             │
├─────────────────────────────┤
│                             │
│  [消息列表]                  │
│                             │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 发送失败，请重试    │    │ ← 错误提示
│  └─────────────────────┘    │
│  [输入框] [发送按钮]        │
└─────────────────────────────┘
```

### 条件渲染

```typescript
// 只在有错误时显示
{state.error && <div className={styles.error}>{state.error}</div>}
```

## 12. 你的任务

1. 在 `src/types/index.ts` 添加 API 相关类型
2. 创建 `src/services/chat.ts` API 服务模块
3. 修改 `src/App.tsx` 使用真实 API
4. 在 `src/App.module.css` 添加错误提示样式

完成后告诉我，我帮你检查！

## 12. 注意事项

- ⚠️ 真实 API 需要后端配合
- ⚠️ 生产环境不要暴露 API Key
- ⚠️ 添加请求超时处理
- ⚠️ 处理网络错误和服务器错误
- ⚠️ 考虑添加请求重试机制