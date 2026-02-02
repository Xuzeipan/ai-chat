# 数据库 Schema 设计案例

## 基础实现

编辑 `prisma/schema.prisma` 文件：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String    // bcrypt 加密后的密码
  nickname      String?
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 关联
  chatSessions  ChatSession[]
  providerConfigs ProviderConfig[]
  usageStats    UsageStat[]

  @@map("users")
}

// AI 供应商配置表
model ProviderConfig {
  id            String    @id @default(uuid())
  userId        String
  provider      String    // openai, claude, gemini, kimi, minimax, deepseek, zhipu, ollama
  apiKey        String    // AES 加密存储
  baseUrl       String?   // 自定义 API 地址（可选）
  defaultModel  String?   // 默认使用的模型
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider])
  @@map("provider_configs")
}

// 聊天会话表
model ChatSession {
  id            String    @id @default(uuid())
  userId        String
  title         String    @default("新对话")
  mode          String    @default("normal") // normal, frontend-mentor, code-reviewer
  provider      String    // 使用的 AI 供应商
  model         String    // 使用的具体模型
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages      Message[]

  @@map("chat_sessions")
}

// 消息记录表
model Message {
  id              String    @id @default(uuid())
  sessionId       String
  role            String    // user, assistant, system
  content         String
  tokenCount      Int?      // token 使用量（估算）
  responseTime    Int?      // 响应时间（毫秒）
  createdAt       DateTime  @default(now())

  session         ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@map("messages")
}

// 使用统计表
model UsageStat {
  id              String    @id @default(uuid())
  userId          String
  provider        String
  model           String
  requestCount    Int       @default(0)
  tokenInput      Int       @default(0)
  tokenOutput     Int       @default(0)
  date            DateTime  @db.Date

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider, model, date])
  @@map("usage_stats")
}
```

## 使用示例

### 生成迁移文件

```bash
npx prisma migrate dev --name init
```

### 生成 Prisma Client

```bash
npx prisma generate
```

### 基本 CRUD 操作

```typescript
// 创建用户
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    password: 'hashed_password',
    nickname: '测试用户'
  }
});

// 查询用户及关联数据
const userWithSessions = await prisma.user.findUnique({
  where: { id: 'user_id' },
  include: {
    chatSessions: {
      include: {
        messages: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        }
      }
    },
    providerConfigs: true
  }
});

// 创建会话和消息
const session = await prisma.chatSession.create({
  data: {
    userId: 'user_id',
    title: '前端学习',
    provider: 'openai',
    model: 'gpt-4',
    messages: {
      create: [
        { role: 'user', content: '你好' },
        { role: 'assistant', content: '你好！有什么我可以帮助你的吗？' }
      ]
    }
  }
});
```

## 原理解释

### 数据类型

| 类型 | 说明 |
|------|------|
| `String` | 变长字符串 |
| `DateTime` | 日期时间 |
| `Int` | 整数 |
| `Boolean` | 布尔值 |
| `?` | 可选（nullable） |

### 字段属性

| 属性 | 说明 |
|------|------|
| `@id` | 主键 |
| `@default(uuid())` | 默认生成 UUID |
| `@unique` | 唯一约束 |
| `@default(now())` | 默认当前时间 |
| `@updatedAt` | 自动更新修改时间 |
| `@relation` | 定义关系 |
| `@map` | 映射到数据库表名 |

### 关系类型

1. **一对多**: User → ChatSession (一个用户有多个会话)
2. **级联删除**: `onDelete: Cascade` 删除用户时自动删除关联数据

## 进阶功能

### 添加索引优化

```prisma
model Message {
  // ... 其他字段

  @@index([sessionId, createdAt])
  @@map("messages")
}

model UsageStat {
  // ... 其他字段

  @@index([userId, date])
  @@map("usage_stats")
}
```

## 你的任务

1. 编辑 `prisma/schema.prisma`，添加以上模型定义
2. 运行 `npx prisma migrate dev --name init` 创建数据库表
3. 运行 `npx prisma generate` 生成客户端
4. 测试：创建一两个用户记录验证表结构正确

完成后告诉我，我帮你检查。
