# 数据库 Schema 设计案例

## 基础实现

使用 Supabase Dashboard 创建表，而不是 Prisma schema。

### 1. 用户表 (users)

在 Supabase Dashboard → Table Editor → New Table：

| 字段名 | 类型 | 默认值 | 其他 |
|--------|------|--------|------|
| id | uuid | gen_random_uuid() | Primary Key |
| email | text | - | Unique, Not Null |
| password | text | - | Not Null |
| nickname | text | null | - |
| avatar | text | null | - |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

**SQL 语句**（也可以在 SQL Editor 中执行）：

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null,
  nickname text,
  avatar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2. AI 供应商配置表 (provider_configs)

| 字段名 | 类型 | 默认值 | 其他 |
|--------|------|--------|------|
| id | uuid | gen_random_uuid() | Primary Key |
| user_id | uuid | - | Foreign Key → users(id), onDelete: cascade |
| provider | text | - | Not Null |
| api_key | text | - | Not Null |
| base_url | text | null | - |
| default_model | text | null | - |
| is_active | boolean | true | - |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

**约束**：
- Unique: (user_id, provider)

**SQL 语句**：

```sql
create table provider_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  provider text not null,
  api_key text not null,
  base_url text,
  default_model text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, provider)
);
```

### 3. 聊天会话表 (chat_sessions)

| 字段名 | 类型 | 默认值 | 其他 |
|--------|------|--------|------|
| id | uuid | gen_random_uuid() | Primary Key |
| user_id | uuid | - | Foreign Key → users(id), onDelete: cascade |
| title | text | '新对话' | Not Null |
| mode | text | 'normal' | Not Null |
| provider | text | - | Not Null |
| model | text | - | Not Null |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

**SQL 语句**：

```sql
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  title text default '新对话' not null,
  mode text default 'normal' not null,
  provider text not null,
  model text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 4. 消息记录表 (messages)

| 字段名 | 类型 | 默认值 | 其他 |
|--------|------|--------|------|
| id | uuid | gen_random_uuid() | Primary Key |
| session_id | uuid | - | Foreign Key → chat_sessions(id), onDelete: cascade |
| role | text | - | Not Null (user/assistant/system) |
| content | text | - | Not Null |
| token_count | int | null | - |
| response_time | int | null | - |
| created_at | timestamptz | now() | - |

**SQL 语句**：

```sql
create table messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  token_count int,
  response_time int,
  created_at timestamptz default now()
);
```

### 5. 使用统计表 (usage_stats)

| 字段名 | 类型 | 默认值 | 其他 |
|--------|------|--------|------|
| id | uuid | gen_random_uuid() | Primary Key |
| user_id | uuid | - | Foreign Key → users(id), onDelete: cascade |
| provider | text | - | Not Null |
| model | text | - | Not Null |
| request_count | int | 0 | - |
| token_input | int | 0 | - |
| token_output | int | 0 | - |
| date | date | - | Not Null |

**约束**：
- Unique: (user_id, provider, model, date)

**SQL 语句**：

```sql
create table usage_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  provider text not null,
  model text not null,
  request_count int default 0,
  token_input int default 0,
  token_output int default 0,
  date date not null,
  unique(user_id, provider, model, date)
);
```

## 添加索引优化

在 SQL Editor 中执行：

```sql
-- 消息表索引（加速按会话查询）
create index idx_messages_session_id on messages(session_id);
create index idx_messages_session_created on messages(session_id, created_at);

-- 使用统计索引（加速按用户查询）
create index idx_usage_stats_user_date on usage_stats(user_id, date);

-- 供应商配置索引
create index idx_provider_configs_user on provider_configs(user_id);
```

## 添加更新触发器

自动更新 `updated_at` 字段：

```sql
-- 创建更新函数
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 为用户表添加触发器
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

-- 为供应商配置表添加触发器
create trigger update_provider_configs_updated_at
  before update on provider_configs
  for each row
  execute function update_updated_at_column();

-- 为会话表添加触发器
create trigger update_chat_sessions_updated_at
  before update on chat_sessions
  for each row
  execute function update_updated_at_column();
```

## TypeScript 类型定义

创建 `src/types/database.ts`：

```typescript
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
      provider_configs: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          api_key: string;
          base_url: string | null;
          default_model: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          api_key: string;
          base_url?: string | null;
          default_model?: string | null;
          is_active?: boolean;
        };
        Update: {
          user_id?: string;
          provider?: string;
          api_key?: string;
          base_url?: string | null;
          default_model?: string | null;
          is_active?: boolean;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          mode: string;
          provider: string;
          model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          mode?: string;
          provider: string;
          model: string;
        };
        Update: {
          title?: string;
          mode?: string;
          provider?: string;
          model?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          token_count: number | null;
          response_time: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          token_count?: number | null;
          response_time?: number | null;
        };
        Update: {
          content?: string;
          token_count?: number | null;
          response_time?: number | null;
        };
      };
      usage_stats: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          model: string;
          request_count: number;
          token_input: number;
          token_output: number;
          date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          model: string;
          request_count?: number;
          token_input?: number;
          token_output?: number;
          date: string;
        };
        Update: {
          request_count?: number;
          token_input?: number;
          token_output?: number;
        };
      };
    };
  };
}
```

## 原理解释

### 为什么用 Supabase Dashboard 而不是 Prisma Migrate？

| 方式 | 优点 | 缺点 |
|------|------|------|
| **Supabase Dashboard** | 可视化操作，直观易懂；无需额外工具 | 手动操作，不适合大型团队协作 |
| **Prisma Migrate** | 代码化管理，版本控制；自动化迁移 | 配置复杂，有代码生成问题 |

对于教学项目，Supabase Dashboard 更简单易用。

### 数据类型说明

| PostgreSQL 类型 | TypeScript 对应 | 说明 |
|-----------------|-----------------|------|
| `uuid` | `string` | 唯一标识符，使用 `gen_random_uuid()` 生成 |
| `text` | `string` | 变长字符串 |
| `timestamptz` | `string` | 带时区的时间戳 |
| `int` | `number` | 整数 |
| `boolean` | `boolean` | 布尔值 |
| `date` | `string` | 日期（无时区） |

### 约束说明

- **Primary Key**: 主键，唯一标识每条记录
- **Foreign Key**: 外键，关联其他表，配置 `on delete cascade` 级联删除
- **Unique**: 唯一约束，防止重复数据
- **Not Null**: 非空约束，必须有值

## 你的任务

1. 登录 Supabase Dashboard
2. 在 Table Editor 中创建上述 5 张表
   - 先创建 `users`（没有其他表依赖它）
   - 再创建 `provider_configs` 和 `chat_sessions`（依赖 users）
   - 最后创建 `messages`（依赖 chat_sessions）和 `usage_stats`
3. 在 SQL Editor 中执行索引和触发器语句
4. 创建 `src/types/database.ts`，定义所有表类型
5. 测试：在 Table Editor 中手动插入一条用户记录，验证表结构正确

完成后告诉我，我帮你检查。
