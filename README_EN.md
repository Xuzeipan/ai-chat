# AI Chat Application

An AI chat application built with React + TypeScript + Vite, supporting conversations with local Ollama models.

## Features

### v0.2
- 🎭 **Mode System** - Multiple AI roles (General Chat, Frontend Mentor, Code Reviewer)
- 🧠 **Smart Context** - Automatic conversation history management with sliding window for token optimization
- ⚡ **Streaming Output** - Real-time AI responses with typewriter effect
- 🎛️ **Mode Switching** - One-click switching between different AI roles
- 📋 **System Prompts** - Frontend-led AI behavior control for precise answer style management

### v0.1
- 💬 **Real-time Chat** - Chat with AI models in real-time
- 🎨 **Modern UI** - Clean and beautiful user interface
- 🔄 **Loading States** - Clear loading and error feedback
- 📱 **Responsive Design** - Adapts to different screen sizes
- 🎯 **Type Safety** - Complete TypeScript type definitions

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS Modules
- **AI Model**: Ollama (qwen2.5-coder:7b)

## Prerequisites

- Node.js 18+
- Ollama installed and running
- qwen2.5-coder:7b model downloaded

## Installation

### 1. Clone the Project

```bash
git clone <repository-url>
cd ai-chat
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Ollama

Ensure Ollama is running:

```bash
ollama serve
```

Download the model (if not already installed):

```bash
ollama pull qwen2.5-coder:7b
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
ai-chat/
├── src/
│   ├── components/          # React components
│   │   ├── ChatList/       # Chat list
│   │   ├── MessageBubble/  # Message bubble
│   │   ├── ChatInput/      # Input field
│   │   └── ModeSelector/   # Mode selector (v0.2)
│   ├── services/           # API services
│   │   └── chat.ts         # Ollama API wrapper (with streaming)
│   ├── config/             # Configuration files (v0.2)
│   │   └── modes.ts        # Mode configuration
│   ├── utils/              # Utility functions (v0.2)
│   │   └── context.ts      # Context management
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Type definitions (including Mode, StreamChunk)
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── 教学指南/               # Learning documentation (Chinese)
│   ├── 项目规则.md
│   ├── v0.1/               # v0.1 version examples
│   │   ├── 类型定义/
│   │   ├── UI组件/
│   │   ├── 状态管理/
│   │   ├── API集成/
│   │   └── 样式优化/
│   └── v0.2/               # v0.2 version examples
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

## Usage Guide

### Sending Messages

1. Type your message in the input field
2. Click the "Send" button or press Enter
3. Wait for AI response (streaming output, displayed in real-time)
4. Use Shift+Enter for line breaks

### Mode Switching

1. Click the mode button at the top to switch AI roles
2. Available modes:
   - 💬 **General Chat** - General AI assistant, friendly and concise
   - 👨‍💻 **Frontend Mentor** - Professional frontend engineer with code examples
   - 🔍 **Code Reviewer** - Strict code review expert

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line
- `Ctrl/Cmd + 1/2/3` - Quick mode switch (1=General Chat, 2=Frontend Mentor, 3=Code Reviewer)

## Configuration

### Modifying AI Model

Edit `src/services/chat.ts`:

```typescript
const request: OllamaChatRequest = {
  model: "your-model-name",  // Change to your model name
  messages: context.map(msg => ({
    role: msg.role,
    content: msg.content,
  })),
  stream: true,  // Enable streaming
};
```

### Modifying API URL

Edit `src/services/chat.ts`:

```typescript
const API_BASE_URL = "http://localhost:11434/api";  // Change to your Ollama URL
```

### Customizing Modes

Edit `src/config/modes.ts` to add or modify modes:

```typescript
const MODES: Mode[] = [
  {
    id: 'custom-mode',
    name: 'Custom Mode',
    description: 'Your custom mode description',
    systemPrompt: 'Your system prompt',
    contextLength: 10,
    icon: '🎯',
  },
  // ... other modes
];
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build production version
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Learning Resources

The project includes detailed tutorials in the `教学指南/` directory:

- **项目规则.md** - Development conventions and standards
- **v0.1/** - v0.1 development examples
  - Type definitions
  - UI components (MessageBubble, ChatList, ChatInput)
  - State management
  - API integration
  - Styling optimization
- **v0.2/** - v0.2 development examples
  - Type definitions (Mode, StreamChunk, AppState)
  - Mode configuration (MODES constant)
  - Context management (getContext function)
  - API integration (streaming sendMessageStream)
  - UI components (ModeSelector)
  - State management (complete state management examples)
- **v0.3/** - v0.3 development examples
  - Markdown rendering (marked + highlight.js)
  - MarkdownRenderer component
  - Markdown rendering integration

## Version History

### v0.3 (Completed)

- ✅ Markdown rendering (marked + highlight.js)
- ✅ Code highlighting
- ✅ Table support
- ✅ MarkdownRenderer component
- ✅ Integration with MessageBubble

### v0.2 (Completed)

- ✅ Mode system (General Chat, Frontend Mentor, Code Reviewer)
- ✅ Mode selector UI (responsive design, mobile support)
- ✅ Mode switching functionality
- ✅ System prompt management
- ✅ Context control optimization (sliding window)
- ✅ Streaming output (real-time AI response display)

### v0.1 (Completed)

- ✅ Basic chat functionality
- ✅ User/AI message bubbles
- ✅ Loading state display
- ✅ Error handling
- ✅ Auto-scroll
- ✅ Ollama API integration

## Todo

- [ ] Markdown rendering
- [ ] Message export
- [ ] Dark mode
- [ ] Image upload
- [ ] Voice input
- [ ] Custom modes (user-created modes)
- [ ] Mode memory (remember conversation history per mode)
- [ ] Mode recommendations (auto-recommend mode based on question)
- [ ] Agent System Refactoring (Multi-chat support, Agent replacing Mode)

## License

MIT

## Contributing

Issues and Pull Requests are welcome!
