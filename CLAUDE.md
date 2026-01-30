# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Chat Platform is a Chinese-language AI chat application built as a teaching/learning project. It uses a Monorepo architecture with pnpm workspaces and Turborepo.

**Current Implementation:**
- `apps/client`: React-based chat interface connecting to Ollama (local AI model server)
- `apps/admin`: Placeholder for future admin dashboard
- `apps/server`: Placeholder for future backend API

**Key Features (v0.3):**
- Real-time streaming chat with AI
- Multiple AI modes (General Chat, Frontend Mentor, Code Reviewer)
- Markdown rendering with code syntax highlighting
- Context-aware conversations with sliding window optimization

## Technology Stack

- **Monorepo**: pnpm workspace + Turborepo
- **Package Manager**: pnpm 10.28.1
- **Node.js**: 18+
- **Client**: React 19 + TypeScript 5.9 + Vite 7
- **Styling**: CSS Modules
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
│   └── v0.3/                # v0.3 tutorials
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
Components are organized in folders with co-located CSS modules:
```
components/
├── MessageBubble/
│   ├── MessageBubble.tsx
│   └── MessageBubble.module.css
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

## Teaching Context

This is a teacher-student learning project. The `教学指南/` directory contains detailed tutorials organized by version (v0.1, v0.2, v0.3). Each version has case-based documentation for students to implement features step by step.

When working on this codebase, refer to `教学指南/项目规则.md` for the complete project conventions and current development status.
