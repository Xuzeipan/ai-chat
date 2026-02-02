# Supabase Client 配置案例

## 基础实现

### 1. 安装依赖

```bash
cd apps/server
pnpm add @supabase/supabase-js
```

### 2. 配置 Supabase 连接

在 `.env` 中添加：

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

> 从 Supabase Dashboard → Settings → API 获取：
> - `SUPABASE_URL` - Project URL
> - `SUPABASE_SERVICE_ROLE_KEY` - service_role key（用于服务端，绕过 RLS）

### 3. 创建 Supabase Client 实例

```typescript
// src/config/database.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### 4. 定义数据库类型

```typescript
// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          nickname: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          nickname?: string | null;
          avatar?: string | null;
        };
        Update: {
          email?: string;
          password?: string;
          nickname?: string | null;
          avatar?: string | null;
        };
      };
      // 其他表类型...
    };
  };
}
```

### 5. 添加健康检查

```typescript
// src/index.ts
import { supabase } from "./config/database.js";

// 健康检查
app.get("/health", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) throw error;

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 使用示例

### 基本 CRUD 操作

```typescript
import { supabase } from "../config/database.js";

// 创建用户
const { data: user, error } = await supabase
  .from("users")
  .insert({ email: "test@example.com", password: "hashed_password" })
  .select()
  .single();

// 查询单个用户
const { data: user, error } = await supabase
  .from("users")
  .select("*")
  .eq("email", email)
  .single();

// 查询用户及关联数据（使用 Supabase 的 join 语法）
const { data: userWithSessions, error } = await supabase
  .from("users")
  .select(`
    *,
    chat_sessions (*)
  `)
  .eq("id", userId)
  .single();

// 更新用户
const { data, error } = await supabase
  .from("users")
  .update({ nickname: "新昵称" })
  .eq("id", userId)
  .select();

// 删除用户
const { error } = await supabase
  .from("users")
  .delete()
  .eq("id", userId);
```

## 原理解释

### Supabase Client 是什么

Supabase Client 是官方提供的 JavaScript/TypeScript SDK：
- **直接操作数据库** - 无需 ORM 层，直接通过 REST API 操作 PostgreSQL
- **实时订阅** - 支持数据库变更的实时监听（可选）
- **类型安全** - 可以定义 TypeScript 类型获得代码提示
- **认证集成** - 内置用户认证功能（本项目中我们自己实现 JWT）

### 与 Prisma 的区别

| 特性 | Supabase Client | Prisma |
|------|-----------------|--------|
| 代码生成 | 不需要 | 需要 |
| 类型定义 | 手动维护 | 自动生成 |
| 表结构管理 | Supabase Dashboard | Prisma Migrate |
| 学习曲线 | 低 | 中 |
| 灵活性 | 直接写 SQL | ORM 抽象 |

### 两种 Key 的区别

| Key 类型 | 用途 | 权限 |
|----------|------|------|
| `anon` key | 客户端使用 | 受 RLS 策略限制 |
| `service_role` key | 服务端使用 | 绕过所有 RLS 策略 |

**注意**：Server 端必须使用 `service_role` key，否则会被 RLS 策略阻挡。

## 进阶功能

### 错误处理封装

```typescript
// src/utils/supabase.ts
import { supabase } from "../config/database.js";

export async function query<T>(
  fn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await fn();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");
  return data;
}

// 使用
const user = await query(() =>
  supabase.from("users").select("*").eq("id", id).single()
);
```

### 事务处理

```typescript
// Supabase 支持 RPC 调用数据库函数
const { data, error } = await supabase.rpc("create_user_with_config", {
  user_email: email,
  user_password: hashedPassword,
  provider_name: "openai",
  provider_key: encryptedKey,
});
```

需要在 Supabase Dashboard 中创建对应的 PostgreSQL 函数。

## 你的任务

1. 安装 `@supabase/supabase-js`
2. 在 `.env` 中配置 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`
3. 创建 `src/config/database.ts` 初始化 Supabase Client
4. 创建 `src/types/database.ts` 定义表类型（先定义 User 表）
5. 在 Supabase Dashboard 中创建 `users` 表
6. 在 `index.ts` 中添加健康检查
7. 启动服务，访问 `/health` 验证连接

完成后告诉我，我帮你检查。
