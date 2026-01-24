# ChatInput 组件案例

## 1. 组件功能
- 文本输入框
- 发送按钮
- 处理回车键发送
- 加载状态禁用输入
- 空内容不能发送

## 2. 组件文件：src/components/ChatInput.tsx

```typescript
import { useState, KeyboardEvent } from 'react';
import type { ChatInputProps } from '../types';
import styles from './ChatInput.module.css';

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');  // 发送后清空输入框
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 按 Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // 阻止默认换行行为
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? '发送中...' : '发送'}
      </button>
    </div>
  );
}
```

## 3. 样式文件：src/components/ChatInput.module.css

```css
.chatInput {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
}

.textarea:focus {
  border-color: #007aff;
}

.textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.sendButton {
  padding: 0 24px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 44px;
  align-self: flex-end;
}

.sendButton:hover:not(:disabled) {
  background-color: #0056b3;
}

.sendButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

## 4. 代码解析

### useState 管理输入
```typescript
const [input, setInput] = useState('');
```
- `input` 存储当前输入内容
- `setInput` 更新输入内容

### 受控组件
```typescript
<textarea
  value={input}                    // 绑定状态
  onChange={(e) => setInput(e.target.value)}  // 更新状态
/>
```
- React 推荐使用受控组件
- 值由 React 状态控制
- 变化时更新状态

### 键盘事件处理
```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();  // 阻止换行
    handleSend();        // 发送消息
  }
};
```
- `e.key` 判断按键
- `e.shiftKey` 检测 Shift 键
- `e.preventDefault()` 阻止默认行为

### 禁用逻辑
```typescript
disabled={!input.trim() || isLoading}
```
- 空内容时禁用
- 加载中时禁用
- `trim()` 去除首尾空格

### 发送后清空
```typescript
setInput('');  // 清空输入框
```
- 发送成功后清空
- 准备下一次输入

## 5. 新概念：受控组件

### 什么是受控组件
- 表单元素的值由 React 状态控制
- 用户输入通过事件更新状态
- React 成为"唯一数据源"

### 受控 vs 非受控
```typescript
// 受控组件（推荐）
<input value={input} onChange={e => setInput(e.target.value)} />

// 非受控组件（不推荐）
<input defaultValue={input} />
```

### 为什么用受控组件
1. 数据流清晰
2. 容易验证和格式化
3. 可以实时响应输入变化

## 6. 使用示例

```typescript
import { ChatInput } from './components/ChatInput';

function App() {
  const handleSend = (content: string) => {
    console.log('发送:', content);
  };

  return (
    <ChatInput 
      onSend={handleSend}
      isLoading={false}
    />
  );
}
```

## 7. 进阶优化（可选）

### 自动调整高度
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [input]);
```

### 字符计数
```typescript
<div className={styles.charCount}>
  {input.length} / 500
</div>
```

### 快捷键提示
```css
.sendButton::after {
  content: ' (Enter)';
  font-size: 12px;
  opacity: 0.7;
}
```

## 你的任务

根据案例，创建以下文件：
1. `src/components/ChatInput.tsx`
2. `src/components/ChatInput.module.css`

完成后告诉我，我帮你检查！