# API Integration Example

## 1. What is API Integration?

**API (Application Programming Interface)**: Application Programming Interface
**API Integration**: Making frontend application communicate with backend services

### Simple Understanding
- API = "Bridge" between applications
- API Integration = Sending requests and receiving data through this bridge

## 2. Project Structure

```
src/
├── services/
│   └── chat.ts          # Chat API service
├── types/
│   └── index.ts         # API related types
└── App.tsx              # Use API service
```

## 3. API Type Definitions

### File: src/types/index.ts (add)

```typescript
// API Request type
interface ChatRequest {
  message: string;
  model?: string;
  temperature?: number;
}

// API Response type
interface ChatResponse {
  success: boolean;
  data: {
    reply: string;
  };
  error?: string;
}

// Ollama chat request
interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

// Ollama chat response
interface OllamaChatResponse {
  model: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
}
```

## 4. API Service Module

### File: src/services/chat.ts

```typescript
import type { ChatRequest, ChatResponse } from '../types';

// API base configuration
const API_BASE_URL = 'https://api.example.com';  // Replace with real API address

// Send message to AI
export async function sendMessage(content: string): Promise<string> {
  const request: ChatRequest = {
    message: content,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add token if authentication is needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data.reply;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;  // Re-throw error, let caller handle
  }
}
```

## 5. Use API in App

### File: src/App.tsx (modify)

```typescript
import { useState } from 'react';
import type { ChatState } from './types';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/chat';  // Import API service
import styles from './App.module.css';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  const handleSend = async (content: string) => {
    // 1. Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }));

    // 2. Call API
    try {
      const reply = await sendMessage(content);

      // 3. Add AI reply
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: reply,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      // 4. Error handling
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Send failed, please try again',
      }));
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>AI Chat</div>
      <ChatList messages={state.messages} />
      <ChatInput onSend={handleSend} isLoading={state.loading} />
      {state.error && <div className={styles.error}>{state.error}</div>}
    </div>
  );
}

export default App;
```

## 6. Code Explanation

### fetch API
```typescript
const response = await fetch(url, {
  method: 'POST',              // Request method
  headers: {                   // Request headers
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),  // Request body
});
```

### Response Handling
```typescript
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
```

### Error Handling
```typescript
try {
  const reply = await sendMessage(content);
  // Success handling
} catch (error) {
  // Error handling
  setState((prev) => ({
    ...prev,
    loading: false,
    error: error instanceof Error ? error.message : 'Send failed',
  }));
}
```

## 7. Common HTTP Status Codes

| Status Code | Meaning | Handling |
|-------------|---------|----------|
| 200 | Success | Process response normally |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Prompt user to login |
| 403 | Forbidden | Prompt insufficient permissions |
| 404 | Not Found | Check API address |
| 500 | Server Error | Prompt to try again later |

## 8. Request Interceptor (Advanced)

### Create wrapped fetch function

```typescript
// src/utils/request.ts

interface RequestConfig extends RequestInit {
  timeout?: number;
}

export async function request<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = 10000, ...fetchConfig } = config;

  // Create timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

### Use wrapped request

```typescript
import { request } from '../utils/request';

export async function sendMessage(content: string): Promise<string> {
  return await request<string>(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
    timeout: 30000,  // 30 second timeout
  });
}
```

## 9. Environment Variable Configuration

### Create .env file
```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your-api-key
```

### Use environment variables
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const response = await fetch(`${API_BASE_URL}/chat`, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
  },
});
```

## 10. Mock Data (for Testing)

### Create Mock Service
```typescript
// src/services/chat.mock.ts

export async function sendMessageMock(content: string): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate AI reply
  const responses = [
    `I received your message: "${content}"`,
    `You make a good point, "${content}"`,
    `Regarding "${content}", I need more information to answer`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
```

### Conditional Use Mock
```typescript
const USE_MOCK = true;  // Use mock during development

export async function sendMessage(content: string): Promise<string> {
  if (USE_MOCK) {
    return sendMessageMock(content);
  }
  // Real API call
  // ...
}
```

## 11. Error Message Styles

### File: src/App.module.css (add)

```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;

  .header {
    padding: 16px;
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }

  .error {
    color: #ff4444;
    padding: 12px 16px;
    background-color: #ffe6e6;
    border-radius: 8px;
    margin: 8px 16px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ffcccc;
  }
}
```

### Style Explanation

```css
.error {
  color: #ff4444;              /* Red text */
  padding: 12px 16px;          /* Padding */
  background-color: #ffe6e6;   /* Light red background */
  border-radius: 8px;          /* Rounded corners */
  margin: 8px 16px;            /* Margin */
  text-align: center;          /* Center text */
  font-size: 14px;             /* Font size */
  border: 1px solid #ffcccc;   /* Border */
}
```

### Display Effect

When API request fails, error message displays above input box:

```
┌─────────────────────────────┐
│         AI Chat             │
├─────────────────────────────┤
│                             │
│  [Message List]             │
│                             │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │  Send failed, retry │    │ ← Error message
│  └─────────────────────┘    │
│  [Input Box] [Send Button]  │
└─────────────────────────────┘
```

### Conditional Rendering

```typescript
// Show only when there's an error
{state.error && <div className={styles.error}>{state.error}</div>}
```

## 12. Your Task

1. Add API-related types in `src/types/index.ts`
2. Create `src/services/chat.ts` API service module
3. Modify `src/App.tsx` to use real API
4. Add error message styles in `src/App.module.css`

When done, tell me and I'll help you check!

## 13. Notes

- ⚠️ Real API requires backend cooperation
- ⚠️ Don't expose API Key in production
- ⚠️ Add request timeout handling
- ⚠️ Handle network errors and server errors
- ⚠️ Consider adding request retry mechanism
