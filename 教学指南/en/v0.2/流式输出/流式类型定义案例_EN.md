# Streaming Type Definition Example

## 1. StreamChunk Interface Definition

```typescript
// Data chunk type for streaming response
interface StreamChunk {
  done: boolean;           // Whether completed
  message?: {
    role: string;          // Message role
    content: string;       // Message content chunk
  };
}
```

## 2. Define in services/chat.ts

```typescript
// src/services/chat.ts

// Data chunk type for streaming response
interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;
  };
}

// Export if needed
export type { StreamChunk };
```

## 3. StreamChunk Data Examples

```typescript
// Example 1: Data chunk
{
  "done": false,
  "message": {
    "role": "assistant",
    "content": "Hello"
  }
}

// Example 2: Another data chunk
{
  "done": false,
  "message": {
    "role": "assistant",
    "content": "! I am"
  }
}

// Example 3: Completion marker
{
  "done": true
}
```

## 4. Why Do We Need StreamChunk?

### Traditional vs Streaming

```typescript
// Traditional: Wait for complete response
interface ApiResponse {
  message: {
    role: string;
    content: string;  // Complete content
  };
}

// Streaming: Receive chunk by chunk
interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;  // Content chunk
  };
}
```

### Data Flow Diagram

```
API Response Stream (multiple StreamChunks):
Chunk 1: { done: false, message: { role: "assistant", content: "Hello" } }
Chunk 2: { done: false, message: { role: "assistant", content: "! I am" } }
Chunk 3: { done: false, message: { role: "assistant", content: " frontend" } }
Chunk 4: { done: false, message: { role: "assistant", content: " mentor" } }
Chunk 5: { done: true }

Frontend concatenates chunk by chunk:
"Hello" → "Hello! I am" → "Hello! I am frontend" → "Hello! I am frontend mentor"
```

## 5. Type Utilities

```typescript
// Extract StreamChunk message type
type StreamMessage = NonNullable<StreamChunk['message']>;

// Extract content type
type StreamContent = StreamMessage['content'];

// Check if done
type IsDone = StreamChunk['done'];
```

## 6. Practical Usage Example

```typescript
// Usage in sendMessageStream
async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void
) {
  const response = await fetch('...', {
    method: 'POST',
    body: JSON.stringify({ stream: true }),
  });

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      const data: StreamChunk = JSON.parse(line);

      if (data.message?.content) {
        onChunk(data.message.content);  // Real-time callback
      }

      if (data.done) {
        onComplete();  // Streaming output complete
        return;
      }
    }
  }
}
```

## 7. Error Handling Types

```typescript
// Define possible error types
type StreamError =
  | { type: 'network'; message: string }
  | { type: 'parse'; message: string }
  | { type: 'timeout'; message: string };

// Extend StreamChunk (optional)
interface StreamChunkWithError extends StreamChunk {
  error?: {
    type: string;
    message: string;
  };
}
```

## 8. Test Cases

```typescript
// Test StreamChunk parsing
const testChunk1: StreamChunk = {
  done: false,
  message: {
    role: 'assistant',
    content: 'Hello',
  },
};

const testChunk2: StreamChunk = {
  done: true,
};

console.log(testChunk1.done); // false
console.log(testChunk1.message?.content); // "Hello"
console.log(testChunk2.done); // true
```

## Your Task

1. Add `StreamChunk` interface in `src/services/chat.ts`
2. Export `StreamChunk` type for use by other modules
3. Understand streaming data structure

When done, tell me: "I'm done, please check @src/services/chat.ts"
