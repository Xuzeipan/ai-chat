# ModeSelector Component Example

## 1. Component Structure

```
src/components/
├── ModeSelector/
│   ├── ModeSelector.tsx
│   └── ModeSelector.module.css
```

## 2. ModeSelector.tsx Implementation

```typescript
import React from 'react';
import { Mode } from '../../types';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  modes: Mode[];
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({
  modes,
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className={styles.modeSelector}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`${styles.modeButton} ${
            mode.id === currentMode.id ? styles.active : ''
          }`}
          onClick={() => onModeChange(mode)}
          title={mode.description}
        >
          <span className={styles.modeIcon}>
            {mode.icon || '💬'}
          </span>
          <span className={styles.modeName}>
            {mode.name}
          </span>
        </button>
      ))}
    </div>
  );
}
```

## 3. ModeSelector.module.css Styles

```css
.modeSelector {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
}

.modeButton {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.modeButton:hover {
  background: #f0f0f0;
  border-color: #b0b0b0;
}

.modeButton.active {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

.modeButton.active:hover {
  background: #1565c0;
}

.modeIcon {
  font-size: 16px;
}

.modeName {
  font-size: 14px;
}
```

## 4. Usage in App

```typescript
import { ModeSelector } from './components/ModeSelector';
import MODES from './config/modes';

function App() {
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);

  return (
    <div className={styles.app}>
      {/* Mode Selector */}
      <ModeSelector
        modes={MODES}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
      />

      {/* Chat List */}
      <ChatList messages={messages} />

      {/* Input Box */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
```

## 5. Responsive Design

```css
/* ModeSelector.module.css */
@media (max-width: 768px) {
  .modeSelector {
    padding: 8px 12px;
  }

  .modeButton {
    padding: 6px 12px;
    font-size: 13px;
  }

  .modeName {
    display: none; /* Hide name on mobile, show only icon */
  }

  .modeIcon {
    font-size: 18px;
  }
}
```

## Your Task

1. Create `ModeSelector` folder in `src/components/` directory
2. Create `ModeSelector.tsx` component
3. Create `ModeSelector.module.css` style file
4. Implement basic functionality (mode selection, switching animation)

When done, tell me: "I'm done, please check @src/components/ModeSelector"
