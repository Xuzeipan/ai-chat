# API Streaming Transformation Example

## 1. sendMessageStream Function Implementation

```typescript
import { Message } from '../types';

interface StreamChunk {
  done: boolean;
  message?: {
    role: string;
    content: string;
  };
}

/**
 * Stream message to Ollama API
 * @param context - Context message array (contains system prompt)
 * @param onChunk - Callback when new content is received
 * @param onComplete - Callback when streaming output is complete
 * @param onError - Callback when error occurs
 */
export async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    stream: true,  // Enable streaming output
  };

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      // Decode data chunk
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      // Parse JSON line by line
      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line);

          if (data.message?.content) {
            // Real-time callback with new content
            onChunk(data.message.content);
          }

          if (data.done) {
            onComplete();
            return;
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  } catch (error) {
    onError(error as Error);
  }
}
```

## 2. Traditional vs Streaming

```typescript
// Traditional: Wait for complete response
export async function sendMessage(content: string, context: Message[]): Promise<string> {
  const request = {
    model: "qwen2.5-coder:7b",
    messages: context.map(msg => ({ role: msg.role, content: msg.content })),
    stream: false,  // Disable streaming
  };

  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data.message.content;  // Return complete content
}

// Streaming: Receive chunk by chunk
export async function sendMessageStream(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  // ... receive chunk by chunk with real-time callbacks
}
```

## 3. Streaming Output Principle

### ReadableStream API

```typescript
// 1. Get response body
const response = await fetch('...');
const body = response.body;  // ReadableStream

// 2. Create reader
const reader = body.getReader();  // ReadableStreamDefaultReader

// 3. Read data chunks
while (true) {
  const { done, value } = await reader.read();
  if (done) break;  // Reading complete

  // value is Uint8Array, need to decode
  const chunk = decoder.decode(value);
  processChunk(chunk);
}
```

### Data Flow Diagram

```
API Response Stream:
{"done":false,"message":{"role":"assistant","content":"Hello"}}
{"done":false,"message":{"role":"assistant","content":"! I am"}}
{"done":false,"message":{"role":"assistant","content":" frontend"}}
{"done":false,"message":{"role":"assistant","content":" mentor"}}
{"done":true}

Chunk-by-chunk parsing:
Chunk 1 → "Hello"
Chunk 2 → "! I am"
Chunk 3 → " frontend"
Chunk 4 → " mentor"
Chunk 5 → Complete

User sees:
Hello → Hello! I am → Hello! I am frontend → Hello! I am frontend mentor
```

## 4. Error Handling and Edge Cases

```typescript
// Add timeout handling
export async function sendMessageStreamWithTimeout(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  timeout: number = 60000  // Default 60 seconds
): Promise<void> {
  const timeoutId = setTimeout(() => {
    onError(new Error('Request timeout'));
  }, timeout);

  try {
    await sendMessageStream(context, onChunk, onComplete, onError);
  } finally {
    clearTimeout(timeoutId);
  }
}

// Add retry logic
export async function sendMessageStreamWithRetry(
  context: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  maxRetries: number = 3
): Promise<void> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await sendMessageStream(context, onChunk, onComplete, onError);
      return;
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        onError(error as Error);
        return;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
}
```

## 5. Performance Optimization

```typescript
// Use requestAnimationFrame to optimize rendering frequency
let pendingUpdate = false;

function optimizedOnChunk(content: string) {
  if (!pendingUpdate) {
    pendingUpdate = true;
    requestAnimationFrame(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: msg.content + content }
          : msg
      ));
      pendingUpdate = false;
    });
  }
}
```

## 6. Test Cases

```typescript
// Test streaming output
async function testStreamOutput() {
  const chunks: string[] = [];

  await sendMessageStream(
    context,
    (content) => {
      chunks.push(content);
      console.log('Received content chunk:', content);
    },
    () => {
      console.log('Streaming output complete');
      console.log('All chunks:', chunks);
      console.log('Complete content:', chunks.join(''));
    },
    (error) => {
      console.error('Streaming output error:', error);
    }
  );
}
```

## Your Task

1. Implement `sendMessageStream` function in `src/services/chat.ts`
2. Understand how ReadableStream API works
3. Test streaming output functionality
4. Verify error handling

When done, tell me: "I'm done, please check @src/services/chat.ts"
