# AI 聊天应用

基于 React + TypeScript + Vite 构建的 AI 聊天应用，支持与本地 Ollama 模型进行对话。

## 功能特性

### v0.2
- 🎭 模式系统 - 多种 AI 角色（普通聊天、前端导师、代码审查）
- 🧠 智能上下文 - 自动管理对话历史，滑动窗口优化 token 使用
- ⚡ 流式输出 - 实时显示 AI 回复，打字机效果
- 🎛️ 模式切换 - 一键切换不同的 AI 角色
- 📋 系统提示 - 前端主导 AI 行为，精准控制回答风格

### v0.1
- 💬 实时对话 - 与 AI 模型进行实时聊天
- 🎨 现代界面 - 简洁美观的用户界面
- 🔄 加载状态 - 清晰的加载和错误提示
- 📱 响应式设计 - 适配不同屏幕尺寸
- 🎯 类型安全 - 完整的 TypeScript 类型定义

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite 7
- **样式**: CSS Modules
- **AI 模型**: Ollama (qwen2.5-coder:7b)

## 前置要求

- Node.js 18+
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

```bash
npm run dev
```

访问 http://localhost:5173

## 项目结构

```
ai-chat/
├── src/
│   ├── components/          # React 组件
│   │   ├── ChatList/       # 聊天列表
│   │   ├── MessageBubble/  # 消息气泡
│   │   ├── ChatInput/      # 输入框
│   │   └── ModeSelector/   # 模式选择器 (v0.2)
│   ├── services/           # API 服务
│   │   └── chat.ts         # Ollama API 封装（含流式输出）
│   ├── config/             # 配置文件 (v0.2)
│   │   └── modes.ts        # 模式配置
│   ├── utils/              # 工具函数 (v0.2)
│   │   └── context.ts      # 上下文管理
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 类型定义（含 Mode、StreamChunk）
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── 教学指南/               # 学习文档
│   ├── 项目规则.md
│   ├── v0.1/               # v0.1 版本案例
│   │   ├── 类型定义/
│   │   ├── UI组件/
│   │   ├── 状态管理/
│   │   ├── API集成/
│   │   └── 样式优化/
│   └── v0.2/               # v0.2 版本案例
│       ├── 类型定义/
│       ├── 模式配置/
│       ├── 上下文管理/
│       ├── API集成/
│       ├── UI组件/
│       └── 状态管理/
├── package.json
├── tsconfig.json
└── vite.config.ts
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

编辑 `src/services/chat.ts`：

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

编辑 `src/services/chat.ts`：

```typescript
const API_BASE_URL = "http://localhost:11434/api";  // 修改为你的 Ollama 地址
```

### 自定义模式

编辑 `src/config/modes.ts` 添加或修改模式：

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

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 运行 ESLint 检查
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

- [ ] Markdown 渲染
- [ ] 消息导出
- [ ] 深色模式
- [ ] 图片上传
- [ ] 语音输入
- [ ] 自定义模式（用户创建自己的模式）
- [ ] 模式记忆（记住每个模式下的对话历史）
- [ ] 模式推荐（根据问题自动推荐模式）
- [ ] 智能体系统重构（多聊天记录支持，Agent 替代 Mode）

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！