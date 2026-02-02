# Server 端 SSE 流式对话案例

## 基础实现

### 1. 聊天服务

```typescript
// src/services/chat.service.ts
import { supabase } from '../config/database.js';
import { providerService } from './provider.service.js';
import { getAdapter, ProviderType } from './ai/index.js';
import { Response } from 'express';

export interface SendMessageInput {
  userId: string;
  sessionId?: string;
  message: string;
  provider: ProviderType;
  model: string;
  mode?: string;
}

export class ChatService {
  // 发送消息（流式）
  async sendMessageStream(
    input: SendMessageInput,
    res: Response
  ): Promise<void> {
    const { userId, sessionId, message, provider, model, mode = 'normal' } = input;

    // 获取用户配置
    const config = await providerService.getConfigWithKey(userId, provider);
    if (!config) {
      res.status(400).json({ error: '未配置该供应商' });
      return;
    }

    // 获取或创建会话
    let session = null;
    if (sessionId) {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    }

    if (!session) {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: message.slice(0, 50) || '新对话',
          provider,
          model,
          mode
        })
        .select()
        .single();
      if (error) throw error;
      session = data;
    }

    // 保存用户消息
    await supabase
      .from('messages')
      .insert({
        session_id: session.id,
        role: 'user',
        content: message
      });

    // 获取历史消息
    const { data: historyMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 发送会话ID
    res.write(`event: session\ndata: ${JSON.stringify({ sessionId: session.id })}\n\n`);

    let fullResponse = '';
    const startTime = Date.now();

    // 调用 AI
    const adapter = getAdapter(provider);
    await adapter.chatStream(
      historyMessages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      })),
      {
        model,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        temperature: 0.7
      },
      {
        onChunk: (chunk) => {
          fullResponse += chunk;
          res.write(`event: message\ndata: ${JSON.stringify({ content: chunk })}\n\n`);
        },
        onComplete: async () => {
          // 保存助手回复
          await supabase
            .from('messages')
            .insert({
              session_id: session!.id,
              role: 'assistant',
              content: fullResponse,
              response_time: Date.now() - startTime
            });

          res.write(`event: done\ndata: {}\n\n`);
          res.end();
        },
        onError: (error) => {
          res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        }
      }
    );
  }

  // 获取会话列表
  async getSessions(userId: string) {
    const { data } = await supabase
      .from('chat_sessions')
      .select('id, title, provider, model, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    return (data || []).map(s => ({
      id: s.id,
      title: s.title,
      provider: s.provider,
      model: s.model,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));
  }

  // 获取会话消息
  async getMessages(sessionId: string, userId: string) {
    // 验证会话归属
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) {
      throw new Error('会话不存在');
    }

    const { data } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    return (data || []).map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at
    }));
  }
}

export const chatService = new ChatService();
```

### 2. 聊天路由

```typescript
// src/routes/chat.routes.ts
import { Router } from 'express';
import { supabase } from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { chatService } from '../services/chat.service.js';
import { ProviderType } from '../services/ai/index.js';

const router = Router();

// 发送消息（流式）
router.post('/stream', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await chatService.sendMessageStream(
      {
        userId: req.user!.userId,
        sessionId: req.body.sessionId,
        message: req.body.message,
        provider: req.body.provider as ProviderType,
        model: req.body.model,
        mode: req.body.mode
      },
      res
    );
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

// 获取会话列表
router.get('/sessions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sessions = await chatService.getSessions(req.user!.userId);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 获取会话消息
router.get('/sessions/:id/messages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const messages = await chatService.getMessages(req.params.id, req.user!.userId);
    res.json({ messages });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// src/routes/chat.routes.ts
import { Router } from 'express';
import { supabase } from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { chatService } from '../services/chat.service.js';
import { ProviderType } from '../services/ai/index.js';

const router = Router();

// ... (其他路由保持不变)

// 删除会话
router.delete('/sessions/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 更新会话标题
router.put('/sessions/:id/title', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title } = req.body;
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

### 3. 集成到主应用

```typescript
// src/index.ts
import chatRoutes from './routes/chat.routes.js';

// ... 其他路由
app.use('/api/chat', chatRoutes);
```

## 使用示例

### 测试流式 API

```bash
# 发送消息（流式）
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好",
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  }'
```

响应（SSE 格式）：
```
event: session
data: {"sessionId":"xxx"}

event: message
data: {"content":"你"}

event: message
data: {"content":"好"}

event: message
data: {"content":"！"}

event: done
data: {}
```

### 获取会话列表

```bash
curl http://localhost:3000/api/chat/sessions \
  -H "Authorization: Bearer <token>"
```

## 原理解释

### SSE (Server-Sent Events)

SSE 是服务器向客户端推送实时数据的技术：
- 使用 HTTP 长连接
- 文本协议，格式：`event: xxx\ndata: xxx\n\n`
- 浏览器原生支持 `EventSource`
- 比 WebSocket 简单，适合单向推送

### 事件类型

| 事件 | 说明 |
|------|------|
| `session` | 返回会话ID（新会话时） |
| `message` | 流式返回 AI 回复片段 |
| `done` | 流式输出完成 |
| `error` | 发生错误 |

## 进阶功能

### 添加请求限流

```typescript
// 使用 express-rate-limit
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 分钟
  max: 20 // 最多 20 次请求
});

router.post('/stream', authMiddleware, chatLimiter, async (req, res) => {
  // ...
});
```

## 你的任务

1. 创建 `src/services/chat.service.ts` 聊天服务
2. 创建 `src/routes/chat.routes.ts` 聊天路由
3. 在 `index.ts` 中集成路由
4. 测试流式对话 API

完成后告诉我，我帮你检查。
