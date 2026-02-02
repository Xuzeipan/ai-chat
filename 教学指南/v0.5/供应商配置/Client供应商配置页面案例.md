# Client 供应商配置页面案例

## 基础实现

### 1. 创建供应商配置服务

```typescript
// src/services/provider.ts
import api from '../utils/api.js';

export interface Provider {
  id: string;
  name: string;
  icon: string;
}

export interface ProviderConfig {
  id: string;
  provider: string;
  baseUrl: string | null;
  defaultModel: string | null;
  isActive: boolean;
}

export interface Model {
  id: string;
  name: string;
  maxTokens: number;
  supportStream: boolean;
}

export async function getProviders(): Promise<Provider[]> {
  const response = await api.get('/providers');
  return response.data.providers;
}

export async function getUserConfigs(): Promise<ProviderConfig[]> {
  const response = await api.get('/providers/configs');
  return response.data.configs;
}

export async function saveConfig(data: {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}): Promise<ProviderConfig> {
  const response = await api.post('/providers/configs', data);
  return response.data.config;
}

export async function deleteConfig(id: string): Promise<void> {
  await api.delete(`/providers/configs/${id}`);
}

export async function getModels(provider: string): Promise<Model[]> {
  const response = await api.get(`/providers/${provider}/models`);
  return response.data.models;
}

export async function testConnection(data: {
  provider: string;
  apiKey: string;
  baseUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await api.post('/providers/test', data);
  return response.data;
}
```

### 2. 创建供应商配置表单组件

```tsx
// src/components/Settings/ProviderConfigForm.tsx
import { useState, useEffect } from 'react';
import { Provider, Model, testConnection, saveConfig } from '../../services/provider.js';

interface ProviderConfigFormProps {
  provider: Provider;
  existingConfig?: {
    id: string;
    baseUrl: string | null;
    defaultModel: string | null;
  };
  onSaved: () => void;
  onCancel: () => void;
}

export function ProviderConfigForm({
  provider,
  existingConfig,
  onSaved,
  onCancel
}: ProviderConfigFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(existingConfig?.baseUrl || '');
  const [defaultModel, setDefaultModel] = useState(existingConfig?.defaultModel || '');
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // 加载可用模型列表
    import('../../services/provider.js').then(({ getModels }) => {
      getModels(provider.id).then(setModels).catch(console.error);
    });
  }, [provider.id]);

  const handleTest = async () => {
    if (!apiKey) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection({
        provider: provider.id,
        apiKey,
        baseUrl: baseUrl || undefined
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: '测试失败' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setIsLoading(true);
    try {
      await saveConfig({
        provider: provider.id,
        apiKey,
        baseUrl: baseUrl || undefined,
        defaultModel: defaultModel || undefined
      });
      onSaved();
    } catch (error) {
      alert('保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-base-200 p-4 rounded-lg">
      <h3 className="font-bold text-lg">{provider.name} 配置</h3>

      {/* API Key */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">API Key</span>
        </label>
        <div className="join w-full">
          <input
            type={showKey ? 'text' : 'password'}
            className="input input-bordered join-item w-full"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="输入您的 API Key"
            required
          />
          <button
            type="button"
            className="btn join-item"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? '隐藏' : '显示'}
          </button>
        </div>
      </div>

      {/* Base URL（可选） */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Base URL（可选）</span>
        </label>
        <input
          type="url"
          className="input input-bordered"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://api.openai.com/v1"
        />
        <label className="label">
          <span className="label-text-alt">用于自定义代理或本地部署</span>
        </label>
      </div>

      {/* 默认模型 */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">默认模型</span>
        </label>
        <select
          className="select select-bordered"
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
        >
          <option value="">选择默认模型</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <div className={`alert ${testResult.success ? 'alert-success' : 'alert-error'}`}>
          {testResult.message}
        </div>
      )}

      {/* 按钮 */}
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleTest}
          disabled={isTesting || !apiKey}
        >
          {isTesting ? '测试中...' : '测试连接'}
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}
```

### 3. 创建设置页面

```tsx
// src/pages/SettingsPage.tsx
import { useState, useEffect } from 'react';
import {
  Provider,
  ProviderConfig,
  getProviders,
  getUserConfigs,
  deleteConfig
} from '../services/provider.js';
import { ProviderConfigForm } from '../components/Settings/ProviderConfigForm.js';

export function SettingsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [providersData, configsData] = await Promise.all([
        getProviders(),
        getUserConfigs()
      ]);
      setProviders(providersData);
      setConfigs(configsData);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此配置吗？')) return;
    try {
      await deleteConfig(id);
      await loadData();
    } catch (error) {
      alert('删除失败');
    }
  };

  const getConfigForProvider = (providerId: string) => {
    return configs.find((c) => c.provider === providerId);
  };

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      {/* AI 供应商配置 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI 供应商配置</h2>

        {editingProvider ? (
          <ProviderConfigForm
            provider={editingProvider}
            existingConfig={getConfigForProvider(editingProvider.id)}
            onSaved={() => {
              setEditingProvider(null);
              loadData();
            }}
            onCancel={() => setEditingProvider(null)}
          />
        ) : (
          <div className="space-y-2">
            {providers.map((provider) => {
              const config = getConfigForProvider(provider.id);
              return (
                <div
                  key={provider.id}
                  className="flex items-center justify-between bg-base-200 p-4 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    {config ? (
                      <p className="text-sm text-success">已配置</p>
                    ) : (
                      <p className="text-sm text-base-content/50">未配置</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {config && (
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => handleDelete(config.id)}
                      >
                        删除
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setEditingProvider(provider)}
                    >
                      {config ? '编辑' : '配置'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
```

### 4. 添加路由

```tsx
// src/main.tsx
import { SettingsPage } from './pages/SettingsPage.js';

// 添加路由
<Route path="/settings" element={<SettingsPage />} />
```

### 5. 在导航栏添加设置入口

```tsx
// 在 App.tsx 或其他导航组件中添加
<Link to="/settings" className="btn btn-ghost">
  设置
</Link>
```

## 使用示例

1. 点击「设置」进入配置页面
2. 选择一个供应商（如 OpenAI）
3. 输入 API Key，点击「测试连接」
4. 选择默认模型，点击「保存」
5. 配置好的供应商显示「已配置」

## 原理解释

### 受控组件

表单元素（input、select）的 value 由 React state 控制，onChange 更新 state。
这是 React 推荐的处理表单的方式。

### 条件渲染

```tsx
{editingProvider ? (
  <ProviderConfigForm ... />  // 编辑模式
) : (
  <div className="space-y-2">...</div>  // 列表模式
)}
```

根据状态决定渲染哪个组件。

## 进阶功能

### 添加骨架屏

```tsx
// 加载时显示骨架屏
{loading ? (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton h-16 w-full"></div>
    ))}
  </div>
) : (
  // 实际内容
)}
```

## 你的任务

1. 创建 `src/services/provider.ts` 供应商服务
2. 创建 `src/components/Settings/ProviderConfigForm.tsx` 配置表单
3. 创建 `src/pages/SettingsPage.tsx` 设置页面
4. 在 `main.tsx` 中添加路由
5. 在导航栏添加设置入口
6. 测试配置 API Key 的完整流程

完成后告诉我，我帮你检查。
