[简体中文](./README.md) | English

# AI Chat Platform

An AI chat platform built with Monorepo architecture, supporting client, admin, and server applications.

## Features

### Client App (apps/client)

#### v0.4
- 🎨 Tailwind CSS + daisyUI integration
- 🌓 Theme switching (cupcake/dark)
- 🔄 All components refactored with Tailwind
- 📐 Flex layout restructuring

#### v0.3
- 📝 Markdown rendering (marked + highlight.js)
- 💻 Code highlighting
- 📊 Table support
- 🎨 MarkdownRenderer component

#### v0.2
- 🎭 **Mode System** - Multiple AI roles (General Chat, Frontend Mentor, Code Reviewer)
- 🧠 **Smart Context** - Automatic conversation history management with sliding window for token optimization
- ⚡ **Streaming Output** - Real-time AI responses with typewriter effect
- 🎛️ **Mode Switching** - One-click switching between different AI roles
- 📋 **System Prompts** - Frontend-led AI behavior control for precise answer style management

#### v0.1
- 💬 **Real-time Chat** - Chat with AI models in real-time
- 🎨 **Modern UI** - Clean and beautiful user interface
- 🔄 **Loading States** - Clear loading and error feedback
- 📱 **Responsive Design** - Adapts to different screen sizes
- 🎯 **Type Safety** - Complete TypeScript type definitions

## Tech Stack

- **Architecture**: Monorepo (pnpm workspace + Turborepo)
- **Client**: React 19 + TypeScript + Vite 7 + Tailwind CSS + daisyUI
- **Admin**: TBD
- **Server**: Express + TypeScript + Supabase
- **AI Model**: Ollama (qwen2.5-coder:7b)

## Prerequisites

- Node.js 18+
- pnpm 10+
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

Start the client app:

```bash
pnpm client dev
```

Visit http://localhost:5173

## Project Structure

```
ai-chat-platform/
├── apps/
│   ├── client/              # Client application
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── config/      # Configuration files
│   │   │   ├── services/    # API services
│   │   │   ├── types/       # TypeScript types
│   │   │   └── utils/       # Utility functions
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── admin/               # Admin application (TBD)
│   └── server/              # Server application (TBD)
├── packages/
│   ├── shared/              # Shared types and utilities
│   │   └── src/
│   └── ui/                  # Shared UI components
│       └── src/
├── package.json             # Root configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── turbo.json               # Turborepo configuration
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

Edit `apps/client/src/services/chat.ts`:

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

Edit `apps/client/src/services/chat.ts`:

```typescript
const API_BASE_URL = "http://localhost:11434/api";  // Change to your Ollama URL
```

### Customizing Modes

Edit `apps/client/src/config/modes.ts` to add or modify modes:

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

### Monorepo Workspace

The project uses pnpm workspace for dependency management. Dependencies are installed in the root `node_modules`.

- Add dependency to specific app: `pnpm --filter @ai-chat/client add <package>`
- Add dev tool to root: `pnpm add -D <package>`
- Remove dependency: `pnpm --filter @ai-chat/client remove <package>`

## Development Commands

### Root Commands

```bash
pnpm install     # Install all dependencies
pnpm dev         # Start all services
pnpm build       # Build all projects
pnpm clean       # Clean all build artifacts
```

### Client Commands

```bash
pnpm client dev       # Start client development server
pnpm client build     # Build client
pnpm client preview   # Preview client build
pnpm client lint      # Run ESLint
```

### Admin Commands

```bash
pnpm admin dev        # Start admin development server
pnpm admin build      # Build admin
```

### Server Commands

```bash
pnpm server dev       # Start server development server
pnpm server build     # Build server
pnpm server start     # Start server production version
```

## Learning Resources

- **项目规则.md** - Development conventions and standards

## Version History

### v0.4 (Completed)

- ✅ Tailwind CSS + daisyUI integration
- ✅ Theme switching (cupcake/dark)
- ✅ All components refactored with Tailwind (ChatInput, MessageBubble, ChatList, ModeSelector, MarkdownRenderer)
- ✅ App.tsx Flex layout restructuring

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

### Client App
- [ ] Message export
- [x] Dark mode (v0.4 basic implementation)
- [ ] Multiple theme selection (system theme, custom themes - pending)
- [ ] Image upload
- [ ] Voice input
- [ ] Custom modes (user-created modes)
- [ ] Mode memory (remember conversation history per mode)
- [ ] Mode recommendations (auto-recommend mode based on question)
- [ ] Agent System Refactoring (Multi-chat support, Agent replacing Mode)

### Admin App
- [ ] User management
- [ ] Chat history management
- [ ] Data statistics
- [ ] System settings

### Server App (v0.5 In Progress)
- [x] Project initialization (Express + TypeScript)
- [x] Database integration (Supabase)
- [x] User authentication (JWT + bcrypt)
- [ ] AI chat API (streaming)
- [ ] Conversation history storage
- [ ] Multi-model provider configuration

## License

MIT

## Contributing

Issues and Pull Requests are welcome!
