# AI 供应商配置管理案例

## 基础实现

### 1. API Key 加密工具

```typescript
// src/utils/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key!!';

export function encryptApiKey(apiKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, SECRET_KEY);

  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptApiKey(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipher(ALGORITHM, SECRET_KEY);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 2. 供应商配置服务

```typescript
// src/services/provider.service.ts
import { supabase } from '../config/database.js';
import { encryptApiKey, decryptApiKey } from '../utils/crypto.js';
import { getAdapter, ProviderType } from './ai/index.js';

export interface ProviderConfigInput {
  provider: ProviderType;
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface ProviderConfigOutput {
  id: string;
  provider: string;
  baseUrl: string | null;
  defaultModel: string | null;
  isActive: boolean;
}

export class ProviderService {
  // 创建或更新配置
  async upsertConfig(
    userId: string,
    config: ProviderConfigInput
  ): Promise<ProviderConfigOutput> {
    const encryptedKey = encryptApiKey(config.apiKey);

    // 先尝试查询现有配置
    const { data: existing } = await supabase
      .from('provider_configs')
      .select('id')
      .eq('user_id', userId)
      .eq('provider', config.provider)
      .single();

    let result;
    if (existing) {
      // 更新
      const { data, error } = await supabase
        .from('provider_configs')
        .update({
          api_key: encryptedKey,
          base_url: config.baseUrl,
          default_model: config.defaultModel,
          is_active: true
        })
        .eq('id', existing.id)
        .select('id, provider, base_url, default_model, is_active')
        .single();
      if (error) throw error;
      result = data;
    } else {
      // 创建
      const { data, error } = await supabase
        .from('provider_configs')
        .insert({
          user_id: userId,
          provider: config.provider,
          api_key: encryptedKey,
          base_url: config.baseUrl,
          default_model: config.defaultModel
        })
        .select('id, provider, base_url, default_model, is_active')
        .single();
      if (error) throw error;
      result = data;
    }

    return {
      id: result.id,
      provider: result.provider,
      baseUrl: result.base_url,
      defaultModel: result.default_model,
      isActive: result.is_active
    };
  }

  // 获取用户的所有配置
  async getUserConfigs(userId: string): Promise<ProviderConfigOutput[]> {
    const { data, error } = await supabase
      .from('provider_configs')
      .select('id, provider, base_url, default_model, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      provider: item.provider,
      baseUrl: item.base_url,
      defaultModel: item.default_model,
      isActive: item.is_active
    }));
  }

  // 获取单个配置（包含解密的 API Key）
  async getConfigWithKey(
    userId: string,
    provider: ProviderType
  ): Promise<{ apiKey: string; baseUrl?: string; defaultModel?: string } | null> {
    const { data: config, error } = await supabase
      .from('provider_configs')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();

    if (error || !config || !config.is_active) {
      return null;
    }

    return {
      apiKey: decryptApiKey(config.api_key),
      baseUrl: config.base_url || undefined,
      defaultModel: config.default_model || undefined
    };
  }

  // 删除配置
  async deleteConfig(userId: string, configId: string): Promise<void> {
    const { error } = await supabase
      .from('provider_configs')
      .delete()
      .eq('id', configId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // 测试 API Key 是否有效
  async testConnection(
    provider: ProviderType,
    apiKey: string,
    baseUrl?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const adapter = getAdapter(provider);
      const models = await adapter.getModels();

      return {
        success: true,
        message: `连接成功！支持 ${models.length} 个模型`
      };
    } catch (error) {
      return {
        success: false,
        message: `连接失败：${(error as Error).message}`
      };
    }
  }
}

export const providerService = new ProviderService();
```

### 3. 供应商路由

```typescript
// src/routes/provider.routes.ts
import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';
import { providerService } from '../services/provider.service.js';
import { getAdapter, ProviderType } from '../services/ai/index.js';

const router = Router();

// 获取支持的供应商列表
router.get('/', (req, res) => {
  const providers = [
    { id: 'openai', name: 'OpenAI', icon: 'OpenAI' },
    { id: 'claude', name: 'Claude', icon: 'Anthropic' },
    { id: 'gemini', name: 'Gemini', icon: 'Google' },
    { id: 'kimi', name: 'Kimi', icon: 'Moonshot' },
    { id: 'minimax', name: 'MiniMax', icon: 'MiniMax' },
    { id: 'deepseek', name: 'DeepSeek', icon: 'DeepSeek' },
    { id: 'zhipu', name: '智谱 GLM', icon: 'Zhipu' },
    { id: 'ollama', name: 'Ollama (本地)', icon: 'Ollama' }
  ];
  res.json({ providers });
});

// 获取用户配置
router.get('/configs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const configs = await providerService.getUserConfigs(req.user!.userId);
    res.json({ configs });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 添加/更新配置
router.post('/configs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const config = await providerService.upsertConfig(req.user!.userId, req.body);
    res.json({ config });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 删除配置
router.delete('/configs/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await providerService.deleteConfig(req.user!.userId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 获取供应商支持的模型
router.get('/:provider/models', async (req, res) => {
  try {
    const adapter = getAdapter(req.params.provider as ProviderType);
    const models = await adapter.getModels();
    res.json({ models });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 测试连接
router.post('/test', async (req, res) => {
  try {
    const { provider, apiKey, baseUrl } = req.body;
    const result = await providerService.testConnection(
      provider as ProviderType,
      apiKey,
      baseUrl
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

### 4. 集成到主应用

```typescript
// src/index.ts
import providerRoutes from './routes/provider.routes.js';

// ... 其他路由
app.use('/api/providers', providerRoutes);
```

### 5. .env 添加加密密钥

```env
ENCRYPTION_KEY="your-32-char-encryption-key!!"
```

## 使用示例

### API 调用示例

```bash
# 获取供应商列表
curl http://localhost:3000/api/providers

# 添加 OpenAI 配置
curl -X POST http://localhost:3000/api/providers/configs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "apiKey": "sk-xxx",
    "defaultModel": "gpt-3.5-turbo"
  }'

# 获取用户配置
curl http://localhost:3000/api/providers/configs \
  -H "Authorization: Bearer <token>"

# 测试连接
curl -X POST http://localhost:3000/api/providers/test \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "apiKey": "sk-xxx"
  }'
```

## 原理解释

### API Key 加密

为什么需要加密存储 API Key？
- 数据库可能被入侵，明文存储风险极高
- 即使泄露加密数据，没有密钥也无法解密
- AES-256-GCM 提供认证加密，防止篡改

### upsert 操作

`upsert` = update + insert：
- 记录存在则更新
- 记录不存在则创建
- 避免先查询再判断的业务逻辑

## 进阶功能

### 配置验证

```typescript
import { z } from 'zod';

const configSchema = z.object({
  provider: z.enum(['openai', 'claude', 'gemini', 'kimi', 'minimax', 'deepseek', 'zhipu', 'ollama']),
  apiKey: z.string().min(1, 'API Key 不能为空'),
  baseUrl: z.string().url().optional(),
  defaultModel: z.string().optional()
});
```

## 你的任务

1. 创建 `src/utils/crypto.ts` 加密工具
2. 创建 `src/services/provider.service.ts` 供应商服务
3. 创建 `src/routes/provider.routes.ts` 路由
4. 在 `index.ts` 中集成路由
5. 添加 `ENCRYPTION_KEY` 到 `.env`
6. 测试 API Key 的增删改查和加密解密

完成后告诉我，我帮你检查。
