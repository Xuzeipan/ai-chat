# Client 登录页面案例

## 基础实现

### 1. 安装依赖

```bash
cd apps/client
pnpm add axios react-router-dom
pnpm add -D @types/react-router-dom
```

### 2. 创建 axios 实例

```typescript
// src/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器 - 添加 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. 创建认证服务

```typescript
// src/services/auth.ts
import api from '../utils/api.js';
import { User } from '../types/index.js';

export interface AuthResponse {
  user: User;
  token: string;
}

export async function register(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/auth/me');
  return response.data.user;
}
```

### 4. 创建登录组件

```tsx
// src/components/Auth/LoginForm.tsx
import { useState } from 'react';
import { login } from '../../services/auth.js';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitch: () => void;
}

export function LoginForm({ onSuccess, onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onSuccess();
    } catch (err) {
      setError('邮箱或密码错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center">登录</h2>

      {error && (
        <div className="alert alert-error text-sm">{error}</div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">邮箱</span>
        </label>
        <input
          type="email"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">密码</span>
        </label>
        <input
          type="password"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '登录中...' : '登录'}
      </button>

      <p className="text-center text-sm">
        还没有账号？
        <button type="button" className="link" onClick={onSwitch}>
          立即注册
        </button>
      </p>
    </form>
  );
}
```

### 5. 创建注册组件

```tsx
// src/components/Auth/RegisterForm.tsx
import { useState } from 'react';
import { register } from '../../services/auth.js';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitch: () => void;
}

export function RegisterForm({ onSuccess, onSwitch }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await register(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onSuccess();
    } catch (err) {
      setError('注册失败，该邮箱可能已被使用');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center">注册</h2>

      {error && (
        <div className="alert alert-error text-sm">{error}</div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">邮箱</span>
        </label>
        <input
          type="email"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">密码</span>
        </label>
        <input
          type="password"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">确认密码</span>
        </label>
        <input
          type="password"
          className="input input-bordered"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '注册中...' : '注册'}
      </button>

      <p className="text-center text-sm">
        已有账号？
        <button type="button" className="link" onClick={onSwitch}>
          立即登录
        </button>
      </p>
    </form>
  );
}
```

### 6. 创建登录页面

```tsx
// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm.js';
import { RegisterForm } from '../components/Auth/RegisterForm.js';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl p-8">
        {isLogin ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitch={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitch={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
```

### 7. 添加路由配置

```tsx
// src/main.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.js';
import App from './App.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 8. 添加路由守卫

```tsx
// 修改 App.tsx 开头
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // 或显示加载中
  }

  // ... 原有 App 组件逻辑
}
```

## 使用示例

1. 未登录用户访问首页 → 自动跳转到 `/login`
2. 填写邮箱密码 → 点击登录
3. 登录成功 → Token 存入 localStorage → 跳转到首页
4. 后续 API 请求自动携带 Token

## 原理解释

### Token 存储选择

| 方式 | 优点 | 缺点 |
|------|------|------|
| localStorage | 简单易用，跨标签页共享 | XSS 攻击风险 |
| Cookie (HttpOnly) | 安全性高，XSS 无法读取 | 需要后端配合，跨域复杂 |

本项目使用 localStorage，因为：
- 教学项目，简单为主
- Server 和 Client 不同端口，Cookie 跨域需要额外配置

### Axios 拦截器

- **请求拦截器**: 在发送请求前自动添加 Token
- **响应拦截器**: 统一处理错误，如 401 时自动跳转登录页

## 进阶功能

### 记住登录状态

```typescript
// 登录时添加
localStorage.setItem('token', token);
localStorage.setItem('tokenExpire', String(Date.now() + 7 * 24 * 60 * 60 * 1000));

// 验证时检查
const expire = localStorage.getItem('tokenExpire');
if (expire && Date.now() > Number(expire)) {
  localStorage.clear();
  navigate('/login');
}
```

## 你的任务

1. 安装依赖（axios, react-router-dom）
2. 创建 src/utils/api.ts axios 配置
3. 创建 src/services/auth.ts 认证服务
4. 创建 src/components/Auth/LoginForm.tsx
5. 创建 src/components/Auth/RegisterForm.tsx
6. 创建 src/pages/LoginPage.tsx
7. 修改 src/main.tsx 添加路由
8. 修改 App.tsx 添加登录检查
9. 测试登录注册流程

完成后告诉我，我帮你检查。
