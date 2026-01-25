# ModeSelector 组件案例

## 1. 组件结构

```
src/components/
├── ModeSelector/
│   ├── ModeSelector.tsx
│   └── ModeSelector.module.css
```

## 2. ModeSelector.tsx 实现

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

## 3. ModeSelector.module.css 样式

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

## 4. 在 App 中使用

```typescript
import { ModeSelector } from './components/ModeSelector';
import MODES from './config/modes';

function App() {
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);

  return (
    <div className={styles.app}>
      {/* 模式选择器 */}
      <ModeSelector
        modes={MODES}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
      />

      {/* 聊天列表 */}
      <ChatList messages={messages} />

      {/* 输入框 */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
```

## 5. 响应式设计

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
    display: none; /* 在移动端隐藏名称，只显示图标 */
  }

  .modeIcon {
    font-size: 18px;
  }
}
```

## 你的任务

1. 在 `src/components/` 目录下创建 `ModeSelector` 文件夹
2. 创建 `ModeSelector.tsx` 组件
3. 创建 `ModeSelector.module.css` 样式文件
4. 实现基础功能（模式选择、切换动画）

完成后告诉我："我写好了，你检查一下 @src/components/ModeSelector"