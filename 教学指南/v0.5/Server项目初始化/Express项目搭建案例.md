# Express + TypeScript 项目搭建案例

## 基础实现

### 1. 创建 package.json

```json
{
  "name": "@ai-chat/server",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

### 2. 创建 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

### 3. 创建入口文件 src/index.ts

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. 创建 .env 文件

```env
PORT=3000
```

## 使用示例

### 安装依赖

```bash
cd apps/server
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000/health 测试

## 原理解释

### tsx 是什么

tsx 是一个 TypeScript 执行器，功能类似于 ts-node，但更快：
- 使用 esbuild 编译，速度极快
- 支持 watch 模式，自动重启
- 无需先编译再运行，开发体验好

### ES Module vs CommonJS

本项目使用 `"type": "module"` 启用 ES Module：
- 使用 `import/export` 而不是 `require/module.exports`
- Node.js 原生支持，是现代标准
- 与前端代码一致，便于共享类型

### Express 基础概念

1. **app**: Express 应用实例，是程序的入口
2. **中间件(Middleware)**: 处理请求的函数，按顺序执行
3. **路由(Route)**: 定义 URL 和处理函数的映射

## 进阶功能

### 添加路由模块化

```typescript
// src/routes/index.ts
import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API working!' });
});

export default router;
```

```typescript
// src/index.ts 中使用
import apiRoutes from './routes/index.js';

app.use('/api', apiRoutes);
```

## 你的任务

1. 在 apps/server 目录下创建 package.json
2. 创建 tsconfig.json
3. 创建 src/index.ts 入口文件
4. 创建 .env 文件
5. 安装依赖并测试启动

完成后告诉我，我帮你检查。
