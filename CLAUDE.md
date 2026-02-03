# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Chat Platform is a Chinese-language AI chat application built as a teaching/learning project. It uses a Monorepo architecture with pnpm workspaces and Turborepo.

**Current Implementation:**
- `apps/client`: React-based chat interface connecting to Ollama (local AI model server)
- `apps/admin`: Placeholder for future admin dashboard
- `apps/server`: Placeholder for future backend API

**Key Features (v0.4):**
- Real-time streaming chat with AI
- Multiple AI modes (General Chat, Frontend Mentor, Code Reviewer)
- Markdown rendering with code syntax highlighting
- Context-aware conversations with sliding window optimization
- Tailwind CSS + daisyUI theme system (cupcake/dark)
- Responsive Flex layout

## Technology Stack

- **Monorepo**: pnpm workspace + Turborepo
- **Package Manager**: pnpm 10.28.1
- **Node.js**: 18+
- **Client**: React 19 + TypeScript 5.9 + Vite 7
- **Styling**: Tailwind CSS + daisyUI
- **AI Integration**: Ollama API (qwen2.5-coder:7b model)
- **Markdown**: marked + highlight.js

## Development Commands

### Root Level

```bash
pnpm install      # Install all dependencies
pnpm dev          # Start all services (turbo dev)
pnpm build        # Build all projects (turbo build)
pnpm clean        # Clean all build artifacts
```

### Client App (apps/client)

```bash
pnpm client dev       # Start development server (port 5173)
pnpm client build     # Build for production
pnpm client lint      # Run ESLint
pnpm client preview   # Preview production build
```

### Monorepo Dependency Management

```bash
# Add dependency to specific app
pnpm --filter @ai-chat/client add <package>

# Add dev tool to root
pnpm add -D <package>

# Remove dependency
pnpm --filter @ai-chat/client remove <package>
```

## Project Structure

```
ai-chat-platform/
├── apps/
│   ├── client/              # User-facing React app (functional)
│   │   ├── src/
│   │   │   ├── components/  # React components (PascalCase, co-located CSS modules)
│   │   │   ├── config/      # Configuration (modes.ts)
│   │   │   ├── services/    # API services (chat.ts - Ollama integration)
│   │   │   ├── types/       # TypeScript types (index.ts)
│   │   │   └── utils/       # Utilities (context.ts - sliding window)
│   │   ├── package.json     # @ai-chat/client
│   │   └── vite.config.ts   # Vite config with @/ alias
│   ├── admin/               # Admin dashboard (placeholder)
│   └── server/              # Backend API (placeholder)
├── packages/
│   ├── shared/              # Shared types/utilities (empty)
│   └── ui/                  # Shared UI components (empty)
├── 教学指南/                # Teaching documentation (Chinese)
│   ├── 项目规则.md          # Project rules and conventions
│   ├── v0.1/                # v0.1 tutorials
│   ├── v0.2/                # v0.2 tutorials
│   ├── v0.3/                # v0.3 tutorials
│   └── v0.4/                # v0.4 tutorials (Tailwind + daisyUI)
├── package.json             # Root configuration
├── pnpm-workspace.yaml      # pnpm workspace config
└── turbo.json               # Turborepo pipeline config
```

## Code Conventions

### Type Definitions
- Location: `apps/client/src/types/index.ts`
- Objects: use `interface`
- Unions: use `type`
- All types must be `export`

### Naming Conventions
- Components: PascalCase (e.g., `MessageBubble`)
- Props interfaces: `ComponentNameProps` (e.g., `MessageBubbleProps`)
- Event callbacks: `on` prefix (e.g., `onSend`)
- Booleans: `is` prefix (e.g., `isLoading`)

### Component Structure
Components are organized in folders with Tailwind CSS classes:
```
components/
├── MessageBubble/
│   └── MessageBubble.tsx      # Tailwind classes + daisyUI
├── ThemeToggle/
│   └── ThemeToggle.tsx        # Theme switching component
```

## Key Files

- **Types**: `apps/client/src/types/index.ts` - Message, ChatState, Mode, StreamChunk, etc.
- **Modes Config**: `apps/client/src/config/modes.ts` - AI mode definitions
- **Chat Service**: `apps/client/src/services/chat.ts` - Ollama API integration (streaming)
- **Context Utils**: `apps/client/src/utils/context.ts` - Sliding window context management
- **Main App**: `apps/client/src/App.tsx` - Root component with state management

## Prerequisites for Development

1. Node.js 18+
2. pnpm 10+
3. Ollama installed and running (`ollama serve`)
4. qwen2.5-coder:7b model downloaded (`ollama pull qwen2.5-coder:7b`)

## Known Issues & Solutions

### Server 端 dotenv 配置问题

**问题**：在 Monorepo 根目录运行 `pnpm server` 时，`dotenv` 默认从**当前工作目录**（CWD）查找 `.env` 文件，导致无法正确加载 `apps/server/.env` 中的环境变量。

**错误表现**：
```
Error: supabaseUrl is required.
```

**解决方案**：创建 `apps/server/src/config/env.ts` 文件，基于文件位置而非工作目录加载 `.env`：

```typescript
// apps/server/src/config/env.ts
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPathFromFile = path.join(__dirname, "../../.env");  // 基于文件位置
const envPathFromCwd = path.join(process.cwd(), ".env");    // 基于运行目录

const envPath = fs.existsSync(envPathFromFile) ? envPathFromFile : envPathFromCwd;
dotenv.config({ path: envPath });
```

然后在所有需要访问环境变量的文件最开始导入：
```typescript
import "./config/env.js";  // 必须在其他导入之前
```

这样无论从哪个目录启动（根目录或 apps/server），都能正确找到 `.env` 文件。

## Teaching Context

This is a teacher-student learning project. The `教学指南/` directory contains detailed tutorials organized by version (v0.1, v0.2, v0.3). Each version has case-based documentation for students to implement features step by step.

When working on this codebase, refer to `项目规则.md` in the root directory for the complete project conventions and current development status.
