# AI 聊天应用

基于 React + TypeScript + Vite 构建的 AI 聊天应用，支持与本地 Ollama 模型进行对话。

## 功能特性

- 💬 实时对话 - 与 AI 模型进行实时聊天
- 🎭 模式系统 - 多种 AI 角色（普通聊天、前端导师、代码审查）
- 🧠 智能上下文 - 自动管理对话历史，优化 token 使用
- 🎨 现代界面 - 简洁美观的用户界面
- ⚡ 快速响应 - 基于 Vite 的极速开发体验
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
npm install
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
│   │   └── ChatInput/      # 输入框
│   ├── services/           # API 服务
│   │   └── chat.ts         # Ollama API 封装
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── 教学指南/               # 学习文档
│   ├── 项目规则.md
│   └── v0.1/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 使用说明

### 发送消息

1. 在输入框中输入消息
2. 点击"发送"按钮或按 Enter 键
3. 等待 AI 回复
4. 使用 Shift+Enter 换行

### 快捷键

- `Enter` - 发送消息
- `Shift + Enter` - 换行

## 配置

### 修改 AI 模型

编辑 `src/services/chat.ts`：

```typescript
const request: OllamaChatRequest = {
  model: "your-model-name",  // 修改为你的模型
  messages: [{ role: "user", content }],
  stream: false,
};
```

### 修改 API 地址

编辑 `src/services/chat.ts`：

```typescript
const API_BASE_URL = "http://localhost:11434/api";  // 修改为你的 Ollama 地址
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
  - UI 组件
  - 状态管理
  - API 集成
  - 样式优化

## 版本历史

### v0.2 (开发中)

- 🔄 模式系统（普通聊天、前端导师、代码审查）
- 🔄 系统提示管理
- 🔄 上下文控制优化
- 🔄 模式选择器 UI

### v0.1 (已完成)

- ✅ 基础聊天功能
- ✅ 用户/AI 消息气泡
- ✅ 加载状态显示
- ✅ 错误处理
- ✅ 自动滚动
- ✅ Ollama API 集成

## 待办事项

- [ ] 模式系统实现
- [ ] 上下文管理优化
- [ ] 模式选择器组件
- [ ] Markdown 渲染
- [ ] 消息导出
- [ ] 深色模式
- [ ] 图片上传
- [ ] 语音输入

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！