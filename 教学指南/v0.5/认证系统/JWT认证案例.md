# JWT 认证系统案例

## 基础实现

### 1. 安装依赖

```bash
cd apps/server
pnpm add bcrypt jsonwebtoken zod
pnpm add -D @types/bcrypt @types/jsonwebtoken
```

### 2. 类型定义

```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

### 3. JWT 配置

```typescript
// src/config/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token 有效期

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
```

### 4. 认证中间件

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '令牌无效或已过期' });
  }
}
```

### 5. 认证服务

```typescript
// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import { supabase } from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import { AuthResponse } from '../types/index.js';

const SALT_ROUNDS = 10;

export class AuthService {
  // 注册
  async register(email: string, password: string): Promise<AuthResponse> {
    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('用户已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 创建用户
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, password: hashedPassword })
      .select('id, email, nickname, avatar')
      .single();

    if (error || !user) {
      throw new Error('创建用户失败');
    }

    // 生成 Token
    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  // 登录
  async login(email: string, password: string): Promise<AuthResponse> {
    // 查找用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('密码错误');
    }

    // 生成 Token
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar
      },
      token
    };
  }
}

export const authService = new AuthService();
```

### 6. 认证路由

```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { supabase } from '../config/database.js';
import { authService } from '../services/auth.service.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

// 获取当前用户
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, nickname, avatar')
      .eq('id', req.user!.userId)
      .single();

    if (error) throw error;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
```

### 7. 集成到主应用

```typescript
// src/index.ts
import authRoutes from './routes/auth.routes.js';

// ... 其他代码

// 路由
app.use('/api/auth', authRoutes);
```

### 8. .env 配置

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## 使用示例

### 注册请求

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

响应：
```json
{
  "user": {
    "id": "xxx",
    "email": "test@example.com",
    "nickname": null,
    "avatar": null
  },
  "token": "eyJhbG..."
}
```

### 登录后访问受保护接口

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbG..."
```

## 原理解释

### JWT 工作流程

1. **用户登录** → Server 验证 → 生成 JWT → 返回给 Client
2. **Client 存储** Token（localStorage 或 Cookie）
3. **后续请求** 在 Header 中携带 `Authorization: Bearer <token>`
4. **Server 验证** Token 签名和有效期

### bcrypt 密码加密

- 使用盐值(Salt)增加随机性
- 单向哈希，无法逆向解密
- `compare()` 方法比较明文和哈希值

### 中间件机制

Express 中间件按顺序执行，`next()` 调用下一个中间件。
`authMiddleware` 在受保护路由前执行，验证失败时直接返回 401。

## 进阶功能

### 添加请求验证

```typescript
// src/middleware/validation.middleware.ts
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位')
});

export function validateRegister(req, res, next) {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}
```

## 你的任务

1. 安装依赖（bcrypt, jsonwebtoken, zod）
2. 创建 src/types/index.ts 类型定义
3. 创建 src/config/jwt.ts JWT 工具函数
4. 创建 src/middleware/auth.middleware.ts 认证中间件
5. 创建 src/services/auth.service.ts 认证服务
6. 创建 src/routes/auth.routes.ts 路由
7. 在 index.ts 中集成路由
8. 添加 JWT_SECRET 到 .env
9. 测试注册和登录 API

完成后告诉我，我帮你检查。
