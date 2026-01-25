# Type Definition Example - Mode Related

## 1. Mode Interface Definition

```typescript
// Mode type
interface Mode {
  id: string;              // Mode unique identifier
  name: string;            // Mode name
  description: string;     // Mode description
  systemPrompt: string;    // System prompt
  contextLength: number;   // Number of conversations to keep
  icon?: string;           // Mode icon (optional)
}
```

## 2. AppState Type Extension

```typescript
// Assuming basic types exist
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Application state (extended version)
interface AppState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentMode: Mode;        // Current mode
  modes: Mode[];            // All available modes
}
```

## 3. Practical Usage Example

```typescript
// Usage in component
import { useState } from 'react';

function App() {
  const [state, setState] = useState<AppState>({
    messages: [],
    loading: false,
    error: null,
    currentMode: MODES[0],  // Default to first mode
    modes: MODES,
  });

  const handleModeChange = (mode: Mode) => {
    setState(prev => ({
      ...prev,
      currentMode: mode,
    }));
  };

  return (
    <div>
      <ModeSelector
        modes={state.modes}
        currentMode={state.currentMode}
        onModeChange={handleModeChange}
      />
      {/* Other components */}
    </div>
  );
}
```

## 4. Type Utility Examples

```typescript
// Extract mode ID type
type ModeId = Mode['id'];

// Partial update mode
type PartialMode = Partial<Mode>;

// Required properties for creating new mode
type CreateMode = Required<Pick<Mode, 'id' | 'name' | 'systemPrompt' | 'contextLength'>>;
```

## Your Task

Add the following types in `src/types/index.ts`:

1. **Mode Interface**: containing id, name, description, systemPrompt, contextLength, icon
2. **Extended AppState**: add currentMode and modes fields

When done, tell me: "I'm done, please check @src/types/index.ts"
