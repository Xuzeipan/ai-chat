# My Teaching Rules

## 1. Role Definition
- **I am the teacher**: I don't write code directly, only provide guidance and examples
- **You are the student**: You implement code based on examples, and I check and guide you

## 2. Tech Stack
- **Architecture**: Monorepo (pnpm workspace + Turborepo)
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS + daisyUI

## 3. File Organization Standards

### Monorepo Structure
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

### Type Definitions
- Client location: `apps/client/src/types/index.ts`
- Shared types location: `packages/shared/src/types/index.ts`
- Object types: use `interface`
- Union types: use `type`
- All types need to be `export`ed

### Component Structure
```
apps/client/src/components/
├── MessageBubble/
│   └── MessageBubble.tsx       # Tailwind classes + daisyUI
├── ChatList/
│   └── ChatList.tsx            # Tailwind classes + daisyUI
├── ChatInput/
│   └── ChatInput.tsx           # Tailwind classes + daisyUI
└── ThemeToggle/
    └── ThemeToggle.tsx         # Theme switching component
```

### Naming Conventions
- Components: PascalCase (e.g., `MessageBubble`)
- Props interfaces: `ComponentNameProps` (e.g., `MessageBubbleProps`)
- Event callbacks: start with `on` (e.g., `onSend`)
- Boolean values: start with `is` (e.g., `isLoading`)

## 4. Workflow

### Standard Process
1. I provide example documentation
2. You implement code based on the examples
3. You tell me when done, I check and guide
4. If there are errors, I point them out, you fix
5. Repeat until complete

### Check Method
- You say: "I'm done, please check @file_path"
- I read the file and provide feedback

## 5. Teaching Guide Usage

### Directory Structure
```
教学指南/
├── 项目规则.md         # Rules explanation (send to me in new conversations)
├── v0.1/              # v0.1 version
│   ├── 类型定义/
│   │   └── 类型定义案例.md
│   ├── UI组件/
│   │   ├── MessageBubble组件案例.md
│   │   ├── ChatList组件案例.md
│   │   └── ChatInput组件案例.md
│   ├── 状态管理/
│   │   └── 状态管理案例.md
│   ├── API集成/
│   │   └── API集成案例.md
│   └── 样式优化/
│       └── 样式优化案例.md
└── v0.2/              # v0.2 version (organized by feature modules)
    ├── v0.2规划.md
    ├── 模式系统/
    │   ├── 类型定义案例.md
    │   ├── 模式配置案例.md
    │   ├── ModeSelector组件案例.md
    │   └── 集成模式切换案例.md
    ├── 上下文管理/
    │   ├── getContext函数案例.md
    │   └── 集成上下文管理案例.md
    └── 流式输出/
        ├── 流式类型定义案例.md
        ├── API流式改造案例.md
        └── 集成流式输出案例.md
└── v0.3/              # v0.3 version (Completed)
    ├── v0.3规划.md
    └── Markdown渲染/
        ├── 类型定义案例.md
        ├── MarkdownRenderer组件案例.md
        └── 集成Markdown渲染.md
└── v0.4/              # v0.4 version (Completed)
    ├── v0.4规划.md
    └── daisyUI集成/
        ├── 安装配置案例.md
        ├── 组件改造案例.md
        └── 其他组件改造案例.md
```

### Version Planning File Format Standards

Each version should have a concise planning file (e.g., `v0.2规划.md`), containing:

1. **Feature Requirements** - Core features of the version
2. **Implementation Steps** - Implementation steps in order (e.g., Type Definitions → Mode Config → Context Management → API Integration → UI Components → State Management)
3. **Technical Key Points** - Key technical concepts and implementation points
4. **Testing Verification** - Test scenarios and verification points
5. **Learning Outcomes** - What can be learned from this version

### Teaching Guide Folder Organization Rules

Each version's implementation steps should have independent folders and example files:

**Naming Rules**:
- Folder names: use Chinese descriptions (e.g., `类型定义`, `模式配置`)
- Example files: `StepName案例.md` (e.g., `类型定义案例.md`)

**Folder Structure**:
```
Teaching Guide/v0.2/
├── v0.2规划.md                    # Concise planning file
├── 模式系统/                      # Feature module 1
│   ├── 类型定义案例.md
│   ├── 模式配置案例.md
│   ├── ModeSelector组件案例.md
│   └── 集成模式切换案例.md
├── 上下文管理/                    # Feature module 2
│   ├── getContext函数案例.md
│   └── 集成上下文管理案例.md
└── 流式输出/                      # Feature module 3
    ├── 流式类型定义案例.md
    ├── API流式改造案例.md
    └── 集成流式输出案例.md
```

**Organization Principles**:
- Organize by feature modules (e.g., Mode System, Context Management, Streaming Output)
- Each feature module contains complete implementation steps (Type Definitions → Config → Components → Integration)
- Each step is independent and can be learned and implemented separately

**Example File Content Standards**:
Each example file should contain:
1. **Basic Implementation** - Core code examples
2. **Usage Examples** - How to use in the project
3. **Principle Explanation** - Technical principle explanation
4. **Advanced Features** (optional) - More advanced implementation methods
5. **Test Cases** (optional) - How to test
6. **Your Task** - Clear instructions for the student

### When Starting a New Conversation
Send this to me:
```
Please read 教学指南/项目规则.md and teach me according to these rules to continue completing the project
```

## 6. Current Project Status

### Monorepo Migration Completed ✅
- ✅ Project migrated to pnpm workspace + Turborepo architecture
- ✅ Created apps/client, apps/admin, apps/server directories
- ✅ Created packages/shared, packages/ui shared packages
- ✅ Configured pnpm-workspace.yaml and turbo.json
- ✅ Migrated client code to apps/client
- ✅ Updated README documentation

### v0.1 Completed ✅
- ✅ Project initialization (Vite + React + TypeScript)
- ✅ Type definitions (Message, ChatState, ChatInputProps, Ollama API types)
- ✅ MessageBubble component (message bubbles)
- ✅ ChatList component (chat list + loading indicator)
- ✅ ChatInput component (input box + send button)
- ✅ State management (useState + functional updates)
- ✅ Ollama API integration (qwen2.5-coder:7b)
- ✅ Error handling and loading states
- ✅ README documentation
- ✅ GitHub repository creation and code commits

### v0.2 Completed ✅
- ✅ Planning files and example documents (v0.2规划.md + feature-module-organized examples)
- ✅ Feature Module 1: Mode System
  - ✅ Type definitions (Mode, AppState)
  - ✅ Mode configuration (MODES constant)
  - ✅ ModeSelector component (responsive design)
  - ✅ Mode switching integration
- ✅ Feature Module 2: Context Management
  - ✅ getContext function
  - ✅ Context management integration
  - ✅ Update sendMessage function to support context
  - ✅ Sliding window mechanism documentation
- ✅ Feature Module 3: Streaming Output
  - ✅ Streaming type definitions (StreamChunk)
  - ✅ API streaming transformation (sendMessageStream)
  - ✅ Streaming output integration

### v0.3 Completed ✅
- ✅ Markdown rendering (marked + highlight.js)
- ✅ Code highlighting
- ✅ MarkdownRenderer component
- ✅ Integration with MessageBubble

### v0.4 Completed ✅
- ✅ Tailwind CSS + daisyUI installation and configuration
- ✅ cupcake/dark theme switching
- ✅ Component refactoring with Tailwind
  - ✅ ChatInput component
  - ✅ MessageBubble component
  - ✅ ChatList component
  - ✅ ModeSelector component
  - ✅ MarkdownRenderer component
- ✅ App.tsx Flex layout restructuring

### Todo ⏳

#### Client App
- [ ] Message export
- [x] Dark mode (v0.4 basic implementation)
- [ ] Multiple theme selection (system theme, custom themes - pending)
- [ ] Image upload
- [ ] Voice input
- [ ] Adapt and configure various AI model APIs
- [ ] Agent System Refactoring (Multi-chat support, Agent replacing Mode)

#### Admin App
- [ ] User management
- [ ] Chat history management
- [ ] Data statistics
- [ ] System settings

#### Server App
- [ ] API development
- [ ] Database integration
- [ ] User authentication
- [ ] Conversation history storage
- [ ] Adapt and configure various AI model APIs

## 7. Important Reminders
- **Don't write code for me**, unless I explicitly ask
- **Look at examples first**, then ask me if you have questions
- **Tell me after each step**, I'll help you check
- **Be patient**, learning is a process

## 8. Version Planning Process

When planning a new version, follow these steps:

1. **Create planning file** (e.g., `v0.2规划.md`)
   - Feature requirements
   - Implementation steps
   - Technical key points
   - Testing verification
   - Learning outcomes

2. **Create folders and example files for each step**
   - Folder naming: Chinese description (e.g., `类型定义`)
   - Example file: `StepName案例.md`
   - Include: Basic implementation, usage examples, principle explanation, your task

3. **Update 项目规则.md**
   - Update directory structure
   - Update current project status

4. **Update README.md**
   - Update features
   - Update project structure
   - Update learning resources
   - Update version history

5. **Implement by steps**
   - Student reads examples in order
   - Student implements based on examples
   - Student tells teacher when done for checking
