# AI Chat 项目 Monorepo 迁移规划方案

## 项目现状分析

### 当前技术栈
- **前端框架**: React 19.2.0
- **构建工具**: Vite 7.2.4
- **语言**: TypeScript 5.9.3
- **包管理器**: pnpm 10.28.1
- **依赖库**:
  - highlight.js (代码高亮)
  - marked (Markdown 解析)

### 现有目录结构
```
ai-chat/
├── src/
│   ├── components/      # 业务组件
│   ├── config/          # 配置文件
│   ├── services/        # API 服务
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 迁移目标

将当前单仓库项目改造为 **pnpm workspace + Turborepo** 的 Monorepo 架构：
1. **用户端** (apps/client) - 迁移现有 React 应用
2. **管理端** (apps/admin) - 创建空文件夹，后续开发
3. **服务端** (apps/server) - 创建空文件夹，后续开发
4. **共享包** (packages) - 创建空文件夹结构，后续添加内容

---

## 迁移规划

### 阶段一：基础架构搭建

#### 1.1 创建目录结构
```bash
mkdir -p apps/client
mkdir -p apps/admin
mkdir -p apps/server
mkdir -p packages/shared
mkdir -p packages/ui
```

#### 1.2 配置 pnpm workspace
创建根目录 `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 1.3 配置根目录 package.json
```json
{
  "name": "ai-chat-platform",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "clean": "turbo clean && rm -rf node_modules",
    "client": "pnpm --filter @ai-chat/client",
    "admin": "pnpm --filter @ai-chat/admin",
    "server": "pnpm --filter @ai-chat/server"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@10.28.1"
}
```

#### 1.4 配置 Turborepo
创建根目录 `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

### 阶段二：迁移现有代码到 apps/client

#### 2.1 移动文件
```bash
# 移动源代码
mv src apps/client/
mv public apps/client/
mv index.html apps/client/

# 移动配置文件
mv vite.config.ts apps/client/
mv tsconfig.app.json apps/client/
mv tsconfig.node.json apps/client/
mv tsconfig.json apps/client/
mv eslint.config.js apps/client/
```

#### 2.2 修改 apps/client/package.json
```json
{
  "name": "@ai-chat/client",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "highlight.js": "^11.11.1",
    "marked": "^17.0.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/highlight.js": "^10.1.0",
    "@types/marked": "^6.0.0",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
```

#### 2.3 调整 tsconfig.app.json 路径
确保 `apps/client/tsconfig.app.json` 中的路径配置正确：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 阶段三：创建共享包（空结构）

#### 3.1 packages/shared（共享类型和工具）
```bash
mkdir -p packages/shared/src
```

#### 3.2 packages/ui（共享 UI 组件）
```bash
mkdir -p packages/ui/src
```

---

### 阶段四：创建 apps/admin 文件夹（空结构）

```bash
mkdir -p apps/admin
```

---

### 阶段五：创建 apps/server 文件夹（空结构）

```bash
mkdir -p apps/server
```

---

## 最终目录结构

```
ai-chat-platform/
├── apps/
│   ├── client/              # 用户端（现有代码迁移）
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── config/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── admin/               # 管理端（空文件夹，后续开发）
│   │   └── (待添加)
│   │
│   └── server/              # 服务端（空文件夹，后续开发）
│       └── (待添加)
│
├── packages/
│   ├── shared/              # 共享类型和工具（空结构，待添加）
│   │   └── src/
│   │
│   └── ui/                  # 共享 UI 组件（空结构，待添加）
│       └── src/
│
├── package.json             # 根配置
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
└── README.md
```

---

## 迁移步骤清单

### 第一步：备份和准备
- [ ] 备份当前代码（`git add . && git commit -m "backup: before monorepo"`）
- [ ] 确认 pnpm 版本 >= 10.0.0

### 第二步：创建基础架构
- [ ] 创建目录结构（apps/client, apps/admin, apps/server, packages/shared, packages/ui）
- [ ] 创建 pnpm-workspace.yaml
- [ ] 创建根目录 package.json
- [ ] 安装 turbo（`pnpm add -D turbo`）
- [ ] 创建 turbo.json

### 第三步：迁移用户端
- [ ] 移动文件到 apps/client（src, public, index.html, vite.config.ts, tsconfig.json, eslint.config.js）
- [ ] 修改 apps/client/package.json（name: @ai-chat/client）
- [ ] 调整 tsconfig 路径配置
- [ ] 验证运行（`pnpm client dev`）

### 第四步：创建空文件夹结构
- [ ] 创建 packages/shared/src（空结构，待后续添加内容）
- [ ] 创建 packages/ui/src（空结构，待后续添加内容）
- [ ] 创建 apps/admin（空文件夹，待后续开发）
- [ ] 创建 apps/server（空文件夹，待后续开发）

### 第五步：测试和验证
- [ ] 运行 `pnpm install` 安装依赖
- [ ] 运行 `pnpm client dev` 验证用户端正常
- [ ] 运行 `pnpm client build` 验证构建正常

### 第六步：提交代码
- [ ] 更新 .gitignore
- [ ] 提交所有更改
- [ ] 推送到远程仓库

---

## 注意事项

1. **路径别名处理**: 迁移后需要确保 `@/` 别名在 apps/client 中正确配置
2. **依赖管理**: 后续添加共享包时使用 `workspace:*` 协议
3. **空文件夹**: apps/admin、apps/server、packages/shared、packages/ui 当前为空文件夹，后续根据需要添加内容
4. **端口管理**: 用户端使用 5173 端口，后续管理端和服务端使用不同端口
5. **环境变量**: 各端独立管理 `.env` 文件

---

## 技术栈总结

| 模块 | 技术栈 |
|------|--------|
| 用户端 | React 19 + Vite 7 + TypeScript |
| 管理端 | 待定 |
| 服务端 | 待定 |
| 共享包 | TypeScript |
| 包管理 | pnpm workspace |
| 构建工具 | Turborepo |