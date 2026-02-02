# Prisma + Supabase 配置案例

## 基础实现

### 1. 安装依赖

```bash
cd apps/server
pnpm add @prisma/client
pnpm add -D prisma
```

### 2. 初始化 Prisma

```bash
npx prisma init
```

这会创建：
- `prisma/schema.prisma` - 数据模型定义文件
- `.env` - 添加 DATABASE_URL

### 3. 配置 Supabase 连接

在 `.env` 中添加：

```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

> 从 Supabase Dashboard → Settings → Database 获取连接字符串

### 4. 创建 Prisma Client 实例

```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
```

### 5. 添加连接测试

```typescript
// src/index.ts 中添加
import prisma from './config/database.js';

// 启动时测试连接
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 使用示例

### 测试数据库连接

```typescript
// 在 health 接口中添加 DB 状态
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});
```

### Prisma Studio（可视化数据库管理）

```bash
npx prisma studio
```

访问 http://localhost:5555 查看和管理数据

## 原理解释

### Prisma 是什么

Prisma 是现代 Node.js 和 TypeScript 的 ORM：
- **声明式数据模型**: 在 schema.prisma 中定义表结构
- **类型安全**: 自动生成的 TypeScript 类型
- **自动迁移**: 数据库架构变更管理
- **查询引擎**: 优化的查询性能

### Prisma Client 工作流程

1. 定义模型 (schema.prisma)
2. 运行迁移 `prisma migrate dev`
3. 生成客户端 `prisma generate`
4. 在代码中导入使用

### Supabase 连接方式

Supabase 提供两种连接方式：
1. **直接连接**: 使用 Postgres 连接字符串（开发推荐）
2. **连接池**: 使用 PgBouncer（生产环境高并发推荐）

## 进阶功能

### 软删除中间件

```typescript
// src/config/database.ts
prisma.$use(async (params, next) => {
  // 自动处理 deletedAt 软删除
  if (params.model && ['User', 'ChatSession'].includes(params.model)) {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
  }
  return next(params);
});
```

## 你的任务

1. 安装 Prisma 依赖
2. 初始化 Prisma（会创建 prisma/schema.prisma）
3. 在 .env 中配置 Supabase 连接字符串
4. 创建 src/config/database.ts
5. 在 index.ts 中添加数据库连接测试
6. 启动服务，访问 /health 验证数据库连接

完成后告诉我，我帮你检查。
