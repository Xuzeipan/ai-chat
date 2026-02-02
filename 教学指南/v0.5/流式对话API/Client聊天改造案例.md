# Client 聊天改造案例

## 基础实现

### 1. 更新 chat 服务

```typescript
// src/services/chat.ts
import api from '../utils/api.js';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  provider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageOptions {
  message: string;
  provider: string;
  model: string;
  sessionId?: string;
  mode?: string;
  onSessionCreated?: (sessionId: string) => void;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export async function sendMessageStream(options: SendMessageOptions): Promise<void> {
  const { onChunk, onComplete, onError, onSessionCreated, ...payload } = options;

  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(
      `http://localhost:3000/api/chat/stream?token=${token}`,
      { withCredentials: true }
    );

    // 改为 fetch + ReadableStream，因为 EventSource 不支持 POST
    fetch('http://localhost:3000/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const event = parseSSEEvent(line);
          if (!event) continue;

          switch (event.event) {
            case 'session':
              if (event.data.sessionId) {
                onSessionCreated?.(event.data.sessionId);
              }
              break;
            case 'message':
              onChunk(event.data.content || '');
              break;
            case 'done':
              onComplete();
              resolve();
              return;
            case 'error':
              onError(new Error(event.data.error || '未知错误'));
              reject(new Error(event.data.error));
              return;
          }
        }
      }
    }).catch((error) => {
      onError(error);
      reject(error);
    });
  });
}

// 解析 SSE 事件
function parseSSEEvent(data: string): { event: string; data: any } | null {
  const lines = data.trim().split('\n');
  let event = '';
  let eventData = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      eventData = line.slice(5).trim();
    }
  }

  if (!event) return null;

  try {
    return { event, data: JSON.parse(eventData) };
  } catch {
    return { event, data: eventData };
  }
}

// 获取会话列表
export async function getSessions(): Promise<ChatSession[]> {
  const response = await api.get('/chat/sessions');
  return response.data.sessions;
}

// 获取会话消息
export async function getMessages(sessionId: string): Promise<Message[]> {
  const response = await api.get(`/chat/sessions/${sessionId}/messages`);
  return response.data.messages;
}

// 删除会话
export async function deleteSession(sessionId: string): Promise<void> {
  await api.delete(`/chat/sessions/${sessionId}`);
}

// 更新会话标题
export async function updateSessionTitle(sessionId: string, title: string): Promise<void> {
  await api.put(`/chat/sessions/${sessionId}/title`, { title });
}
```

### 2. 创建模型选择器组件

```tsx
// src/components/ModelSelector/ModelSelector.tsx
import { useState, useEffect } from 'react';
import { ProviderConfig, getUserConfigs } from '../../services/provider.js';
import { Model, getModels } from '../../services/ai.js';

interface ModelSelectorProps {
  value: { provider: string; model: string };
  onChange: (value: { provider: string; model: string }) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    if (value.provider) {
      loadModels(value.provider);
    }
  }, [value.provider]);

  const loadConfigs = async () => {
    try {
      const data = await getUserConfigs();
      setConfigs(data);
      // 默认选择第一个
      if (data.length > 0 && !value.provider) {
        onChange({ provider: data[0].provider, model: data[0].defaultModel || '' });
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (provider: string) => {
    try {
      const data = await getModels(provider);
      setModels(data);
    } catch (error) {
      console.error('加载模型失败:', error);
    }
  };

  if (loading) {
    return <span className="loading loading-sm"></span>;
  }

  if (configs.length === 0) {
    return <div className="text-sm text-error">请先配置 AI 供应商</div>;
  }

  return (
    <div className="flex gap-2">
      <select
        className="select select-sm select-bordered"
        value={value.provider}
        onChange={(e) => {
          const provider = e.target.value;
          onChange({ provider, model: '' });
        }}
      >
        {configs.map((config) => (
          <option key={config.provider} value={config.provider}>
            {config.provider}
          </option>
        ))}
      </select>

      <select
        className="select select-sm select-bordered"
        value={value.model}
        onChange={(e) => onChange({ ...value, model: e.target.value })}
      >
        <option value="">选择模型</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### 3. 更新 App.tsx 集成新功能

```tsx
// App.tsx 关键修改部分
import { useEffect, useState } from 'react';
import { ModelSelector } from './components/ModelSelector/ModelSelector.js';
import { sendMessageStream, getSessions, getMessages, ChatSession, Message } from './services/chat.js';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [selectedModel, setSelectedModel] = useState({ provider: '', model: '' });

  // 加载历史会话
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('加载会话失败:', error);
    }
  };

  // 切换会话
  const handleSelectSession = async (sessionId: string) => {
    try {
      const messages = await getMessages(sessionId);
      setMessages(messages);
      setCurrentSessionId(sessionId);

      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setSelectedModel({ provider: session.provider, model: session.model });
      }
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  };

  // 发送消息
  const handleSendMessage = async (content: string) => {
    if (!selectedModel.provider || !selectedModel.model) {
      alert('请先选择模型');
      return;
    }

    // 添加用户消息到界面
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages((prev) => [...prev, userMessage]);

    let assistantContent = '';

    try {
      await sendMessageStream({
        message: content,
        provider: selectedModel.provider,
        model: selectedModel.model,
        sessionId: currentSessionId,
        onSessionCreated: (id) => {
          setCurrentSessionId(id);
          loadSessions(); // 刷新会话列表
        },
        onChunk: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return [...prev.slice(0, -1), { ...last, content: assistantContent }];
            }
            return [...prev, { id: Date.now().toString(), role: 'assistant', content: assistantContent }];
          });
        },
        onComplete: () => {
          // 完成
        },
        onError: (error) => {
          console.error('发送消息失败:', error);
          alert('发送失败: ' + error.message);
        }
      });
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // ... 渲染部分，添加 ModelSelector 和会话列表
}
```

## 使用示例

### 发送消息流程

1. 用户选择供应商和模型
2. 输入消息并发送
3. Client 调用 `/api/chat/stream`
4. 服务端返回 SSE 流式响应
5. Client 实时显示 AI 回复
6. 消息保存到数据库

## 原理解释

### fetch + ReadableStream

为什么不用 EventSource？
- EventSource 只支持 GET 请求
- 我们需要 POST 请求发送消息内容
- 使用 fetch + ReadableStream 手动解析 SSE

### 消息状态管理

```
用户输入 -> 立即显示用户消息 -> 调用 API -> 流式更新助手消息
```

## 进阶功能

### 添加重连机制

```typescript
async function sendMessageWithRetry(options: SendMessageOptions, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendMessageStream(options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## 你的任务

1. 更新 `src/services/chat.ts` 为调用 Server API
2. 创建 `src/components/ModelSelector/ModelSelector.tsx`
3. 修改 `App.tsx` 添加模型选择和会话切换功能
4. 测试完整的聊天流程

完成后告诉我，我帮你检查。
