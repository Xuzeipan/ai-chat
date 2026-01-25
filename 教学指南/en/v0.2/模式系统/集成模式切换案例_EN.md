# Integrate Mode Switching Example

## 1. Integrate ModeSelector in App

```typescript
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { Message, Mode } from './types';
import { sendMessage } from './services/chat';
import MODES from './config/modes';
import styles from './App.module.css';

interface AppState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentMode: Mode;
  modes: Mode[];
}

function App() {
  const [state, setState] = useState<AppState>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0],  // Default mode
    modes: MODES,
  });

  // Mode switching handler
  const handleModeChange = (mode: Mode) => {
    setState((prev) => ({
      ...prev,
      currentMode: mode,
    }));
  };

  // Send message handler
  const handleSend = async (content: string) => {
    if (!content.trim() || state.loading) return;

    // 1. Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }));

    // 2. Send to API
    try {
      const reply = await sendMessage(content);
      // 3. Add AI reply
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: (error as Error).message,
      }));
    }
  };

  return (
    <div className={styles.app}>
      {/* Mode Selector */}
      <ModeSelector
        modes={state.modes}
        currentMode={state.currentMode}
        onModeChange={handleModeChange}
      />

      {/* Error Banner */}
      {state.error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorMessage}>{state.error}</span>
          <button
            className={styles.errorClose}
            onClick={() => setState(prev => ({ ...prev, error: null }))}
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat List */}
      <ChatList
        messages={state.messages}
        loading={state.loading}
      />

      {/* Input Box */}
      <ChatInput
        onSend={handleSend}
        isLoading={state.loading}
      />
    </div>
  );
}

export default App;
```

## 2. Test Mode Switching

### Test Steps
1. Start the application
2. Click different mode buttons
3. Observe if current mode switches correctly
4. Check mode button active states

### Verification Points
- ✅ After clicking mode button, currentMode updates correctly
- ✅ Current mode button shows active state (blue background)
- ✅ Other mode buttons show inactive state (white background)
- ✅ Mode switching doesn't affect existing message list

## 3. Current Mode Display

```typescript
// Display current mode in App
<div className={styles.app}>
  <div className={styles.header}>
    <ModeSelector
      modes={state.modes}
      currentMode={state.currentMode}
      onModeChange={handleModeChange}
    />
    <div className={styles.currentModeInfo}>
      Current Mode: {state.currentMode.name}
    </div>
  </div>
  {/* ... */}
</div>
```

```css
/* App.module.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.currentModeInfo {
  font-size: 14px;
  color: #666;
}
```

## 4. Mode Switching Hint

```typescript
// Add mode switching hint
const handleModeChange = (mode: Mode) => {
  if (mode.id === state.currentMode.id) return;  // Already current mode, skip

  setState((prev) => ({
    ...prev,
    currentMode: mode,
  }));

  // Optional: add transition animation or hint
  console.log(`Switched to mode: ${mode.name}`);
};
```

## 5. Mode Persistence (Optional)

```typescript
import { useEffect } from 'react';

function App() {
  const [state, setState] = useState<AppState>(() => {
    // Read current mode from localStorage
    const savedMode = localStorage.getItem('current-mode');
    const currentMode = savedMode
      ? MODES.find(m => m.id === savedMode) || MODES[0]
      : MODES[0];

    return {
      messages: [],
      loading: false,
      error: null,
      currentMode,
      modes: MODES,
    };
  });

  // Save current mode to localStorage
  useEffect(() => {
    localStorage.setItem('current-mode', state.currentMode.id);
  }, [state.currentMode]);

  // ...
}
```

## 6. Optimization Suggestion: modes Doesn't Need to Be in State

Since `modes` is static configuration and won't change, it doesn't need to be in state. Can optimize to:

```typescript
// Define AppState without modes
interface AppState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentMode: Mode;
  // modes: Mode[];  // ← No need in state
}

function App() {
  const [state, setState] = useState<Omit<AppState, 'modes'>>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0],
  });

  // Use imported MODES constant directly
  return (
    <div className={styles.app}>
      <ModeSelector
        modes={MODES}  // ← Use imported constant directly
        currentMode={state.currentMode}
        onModeChange={handleModeChange}
      />
      {/* ... */}
    </div>
  );
}
```

**Advantages**:
- Reduce state complexity
- modes is static configuration, doesn't need reactive updates
- Cleaner code

## Your Task

1. Update `src/App.tsx` to integrate ModeSelector component
2. Implement handleModeChange function
3. Test mode switching functionality
4. Verify mode switching doesn't affect other functions
5. (Optional) Apply optimization suggestion, remove modes from state

When done, tell me: "I'm done, please check @src/App.tsx"
