[English](./README_EN.md) | 简体中文

# AI Chat Platform

基于 Monorepo 架构的 AI 聊天平台，支持用户端、管理端和服务端。

## 功能特性

### 用户端 (apps/client)

#### v0.3
- 📝 Markdown 渲染（marked + highlight.js）
- 💻 代码高亮
- 📊 表格支持
- 🎨 MarkdownRenderer 组件

#### v0.2
- 🎭 模式系统 - 多种 AI 角色（普通聊天、前端导师、代码审查）
- 🧠 智能上下文 - 自动管理对话历史，滑动窗口优化 token 使用
- ⚡ 流式输出 - 实时显示 AI 回复，打字机效果
- 🎛️ 模式切换 - 一键切换不同的 AI 角色
- 📋 系统提示 - 前端主导 AI 行为，精准控制回答风格

#### v0.1
- 💬 实时对话 - 与 AI 模型进行实时聊天
- 🎨 现代界面 - 简洁美观的用户界面
- 🔄 加载状态 - 清晰的加载和错误提示
- 📱 响应式设计 - 适配不同屏幕尺寸
- 🎯 类型安全 - 完整的 TypeScript 类型定义

## 技术栈

- **架构**: Monorepo (pnpm workspace + Turborepo)
- **用户端**: React 19 + TypeScript + Vite 7
- **管理端**: 待定
- **服务端**: 待定
- **AI 模型**: Ollama (qwen2.5-coder:7b)

## 前置要求

- Node.js 18+
- pnpm 10+
- Ollama 已安装并运行
- qwen2.5-coder:7b 模型已下载

## 安装

### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-chat
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置 Ollama

确保 Ollama 正在运行：

```bash
ollama serve
```

下载模型（如果还没有）：

```bash
ollama pull qwen2.5-coder:7b
```

### 4. 启动开发服务器

启动用户端：

```bash
pnpm client dev
```

访问 http://localhost:5173

## 项目结构

```
ai-chat-platform/
├── apps/
│   ├── client/              # 用户端
│   │   ├── src/
│   │   │   ├── components/  # React 组件
│   │   │   ├── config/      # 配置文件
│   │   │   ├── services/    # API 服务
│   │   │   ├── types/       # TypeScript 类型
│   │   │   └── utils/       # 工具函数
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── admin/               # 管理端（待开发）
│   └── server/              # 服务端（待开发）
├── packages/
│   ├── shared/              # 共享类型和工具
│   │   └── src/
│   └── ui/                  # 共享 UI 组件
│       └── src/
├── 教学指南/                # 学习文档
├── package.json             # 根配置
├── pnpm-workspace.yaml      # pnpm workspace 配置
└── turbo.json               # Turborepo 配置
```

## 使用说明

### 发送消息

1. 在输入框中输入消息
2. 点击"发送"按钮或按 Enter 键
3. 等待 AI 回复（流式输出，实时显示）
4. 使用 Shift+Enter 换行

### 模式切换

1. 点击顶部的模式按钮切换 AI 角色
2. 可选模式：
   - 💬 **普通聊天** - 通用 AI 助手，友好简洁
   - 👨‍💻 **前端导师** - 专业前端工程师，提供代码示例
   - 🔍 **代码审查** - 严格的代码审查专家

### 快捷键

- `Enter` - 发送消息
- `Shift + Enter` - 换行
- `Ctrl/Cmd + 1/2/3` - 快速切换模式（1=普通聊天，2=前端导师，3=代码审查）

## 配置

### 修改 AI 模型

编辑 `apps/client/src/services/chat.ts`：

```typescript
const request: OllamaChatRequest = {
  model: "your-model-name",  // 修改为你的模型
  messages: context.map(msg => ({
    role: msg.role,
    content: msg.content,
  })),
  stream: true,  // 启用流式输出
};
```

### 修改 API 地址

编辑 `apps/client/src/services/chat.ts`：

```typescript
const API_BASE_URL = "http://localhost:11434/api";  // 修改为你的 Ollama 地址
```

### 自定义模式

编辑 `apps/client/src/config/modes.ts` 添加或修改模式：

```typescript
const MODES: Mode[] = [
  {
    id: 'custom-mode',
    name: '自定义模式',
    description: '你的自定义模式描述',
    systemPrompt: '你的系统提示词',
    contextLength: 10,
    icon: '🎯',
  },
  // ... 其他模式
];
```

### Monorepo 工作区

项目使用 pnpm workspace 管理，依赖安装在根目录的 `node_modules` 中。

- 给特定子项目添加依赖：`pnpm --filter @ai-chat/client add <package>`
- 给根目录添加开发工具：`pnpm add -D <package>`
- 移除依赖：`pnpm --filter @ai-chat/client remove <package>`

## 开发命令

### 根目录命令

```bash
pnpm install     # 安装所有依赖
pnpm dev         # 启动所有服务
pnpm build       # 构建所有项目
pnpm clean       # 清理所有构建产物
```

### 用户端命令

```bash
pnpm client dev       # 启动用户端开发服务器
pnpm client build     # 构建用户端
pnpm client preview   # 预览用户端构建
pnpm client lint      # 运行 ESLint 检查
```

### 管理端命令

```bash
pnpm admin dev        # 启动管理端开发服务器
pnpm admin build      # 构建管理端
```

### 服务端命令

```bash
pnpm server dev       # 启动服务端开发服务器
pnpm server build     # 构建服务端
pnpm server start     # 启动服务端生产版本
```

## 学习资源

项目包含详细的教学指南，位于 `教学指南/` 目录：

- **项目规则.md** - 开发规范和约定
- **v0.1/** - v0.1 版本的开发案例
  - 类型定义
  - UI 组件（MessageBubble、ChatList、ChatInput）
  - 状态管理
  - API 集成
  - 样式优化
- **v0.2/** - v0.2 版本的开发案例
  - 类型定义（Mode、StreamChunk、AppState）
  - 模式配置（MODES 常量）
  - 上下文管理（getContext 函数）
  - API 集成（流式输出 sendMessageStream）
  - UI 组件（ModeSelector）
  - 状态管理（完整的状态管理案例）
- **v0.3/** - v0.3 版本的开发案例
  - Markdown 渲染（marked + highlight.js）
  - MarkdownRenderer 组件
  - 集成 Markdown 渲染

## 版本历史

### v0.4 (已完成)

- ✅ Tailwind CSS + daisyUI 集成
- ✅ cupcake/dark 主题切换
- ✅ 所有组件 Tailwind 改造（ChatInput、MessageBubble、ChatList、ModeSelector、MarkdownRenderer）
- ✅ App.tsx Flex 布局重构

### v0.3 (已完成)

- ✅ Markdown 渲染（marked + highlight.js）
- ✅ 代码高亮
- ✅ 表格支持
- ✅ MarkdownRenderer 组件
- ✅ 集成到 MessageBubble

### v0.2 (已完成)

- ✅ 模式系统（普通聊天、前端导师、代码审查）
- ✅ 模式选择器 UI（响应式设计，支持移动端）
- ✅ 模式切换功能
- ✅ 系统提示管理（System Prompt）
- ✅ 上下文控制优化（滑动窗口）
- ✅ 流式输出（实时显示 AI 回复）

### v0.1 (已完成)

- ✅ 基础聊天功能
- ✅ 用户/AI 消息气泡
- ✅ 加载状态显示
- ✅ 错误处理
- ✅ 自动滚动
- ✅ Ollama API 集成

## 待办事项

### 用户端
- [ ] 消息导出
- [x] 深色模式（v0.4 基础实现）
- [ ] 多主题选择（跟随系统主题、自定义主题）
- [ ] 图片上传
- [ ] 语音输入
- [ ] 自定义模式（用户创建自己的模式）
- [ ] 模式记忆（记住每个模式下的对话历史）
- [ ] 模式推荐（根据问题自动推荐模式）
- [ ] 智能体系统重构（多聊天记录支持，Agent 替代 Mode）

### 管理端
- [ ] 用户管理
- [ ] 聊天记录管理
- [ ] 数据统计
- [ ] 系统设置

### 服务端
- [ ] API 接口开发
- [ ] 数据库集成
- [ ] 用户认证
- [ ] 对话历史存储
- [ ] 适配配置各种 AI 模型 API

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！