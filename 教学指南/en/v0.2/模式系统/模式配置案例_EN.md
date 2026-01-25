# Mode Configuration Example

## 1. Predefined Mode Constants

```typescript
import { Mode } from '../types';

// Predefined mode list
const MODES: Mode[] = [
  {
    id: 'normal',
    name: 'General Chat',
    description: 'General AI assistant',
    systemPrompt: 'You are a helpful AI assistant. Answer questions in a concise and friendly manner.',
    contextLength: 10,
    icon: '💬',
  },
  {
    id: 'frontend-mentor',
    name: 'Frontend Mentor',
    description: '10 years of experience frontend engineer',
    systemPrompt: 'You are a frontend engineer with 10 years of experience, specializing in React, TypeScript, and modern frontend development. Your answers should be professional, practical, and include code examples. Encourage questions and guide users to think deeper.',
    contextLength: 15,
    icon: '👨‍💻',
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Strict code review expert',
    systemPrompt: 'You are a strict code review expert. Focus on code quality, performance optimization, and best practices. Point out issues and provide improvement suggestions.',
    contextLength: 20,
    icon: '🔍',
  },
];

export default MODES;
```

## 2. Mode Configuration Description

### General Chat Mode
- **Use Case**: Daily conversations, general questions
- **Features**: Friendly, concise, versatile
- **Context Length**: 10 messages

### Frontend Mentor Mode
- **Use Case**: Frontend technical questions, code learning
- **Features**: Professional, practical, with code examples, guiding thinking
- **Context Length**: 15 messages (need more context to understand questions)

### Code Reviewer Mode
- **Use Case**: Code quality check, performance optimization
- **Features**: Strict, critical, provides improvement suggestions
- **Context Length**: 20 messages (need complete code context)

## 3. Mode Design Principles

### System Prompt Design Key Points
1. **Clear Role**: Tell the model "who you are"
2. **Set Behavior**: Define how the model should answer
3. **Control Scope**: Limit the model's answer boundaries
4. **Specific Requirements**: Give specific answer format and requirements

### Context Length Selection
- **Short Conversations** (5-10): Simple Q&A, quick response
- **Medium Conversations** (10-15): Technical discussion, need context
- **Long Conversations** (15-20): Code review, complex problems

## 4. Extended Mode Examples

```typescript
// Can add more modes
const EXTENDED_MODES: Mode[] = [
  ...MODES,
  {
    id: 'writer',
    name: 'Writing Assistant',
    description: 'Professional writing consultant',
    systemPrompt: 'You are a professional writing consultant, skilled in various writing styles. Help users polish articles, provide writing suggestions, and improve expressions.',
    contextLength: 12,
    icon: '✍️',
  },
  {
    id: 'translator',
    name: 'Translation Expert',
    description: 'Multilingual translation expert',
    systemPrompt: 'You are a multilingual translation expert, able to accurately and fluently translate between different languages. Maintain the tone and style of the original text.',
    contextLength: 8,
    icon: '🌐',
  },
];
```

## 5. Mode Configuration File Structure

It's recommended to put mode configuration in a separate file:

```
src/
├── config/
│   └── modes.ts          # Mode configuration file
├── types/
│   └── index.ts          # Type definitions
└── App.tsx               # Main application
```

## Your Task

1. Create `modes.ts` file in `src/config/` directory
2. Define `MODES` constant with 3 predefined modes
3. Export MODES for use by other modules

When done, tell me: "I'm done, please check @src/config/modes.ts"
