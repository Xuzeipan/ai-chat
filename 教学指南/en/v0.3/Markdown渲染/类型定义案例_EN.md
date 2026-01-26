# Type Definition Example

## Basic Implementation

Add Markdown rendering related type definitions in `src/types/index.ts`:

```typescript
// Markdown rendering configuration
export interface MarkdownRendererProps {
  content: string;                  // Markdown content
  className?: string;               // Optional CSS class name
  enableCodeHighlight?: boolean;    // Whether to enable code highlighting (default: true)
}
```

## Usage Example

```typescript
import type { MarkdownRendererProps } from "../types";

// Used in MessageBubble
interface MessageBubbleProps {
  message: Message;
  markdownProps?: Partial<MarkdownRendererProps>;  // Optional rendering configuration
}
```

## Principle Explanation

1. **`content`** - Markdown text string to render
2. **`className`** - Allows passing additional CSS class names for custom styling
3. **`enableCodeHighlight`** - Controls whether to apply syntax highlighting to code blocks

## Your Task

1. Open `src/types/index.ts`
2. Add `MarkdownRendererProps` interface definition at the end of the file
3. Make sure the type is properly exported
