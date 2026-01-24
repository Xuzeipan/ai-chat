# ChatList 组件案例

## 1. 组件功能
- 接收消息列表数组
- 遍历渲染多个 MessageBubble 组件
- 自动滚动到最新消息

## 2. 组件文件：src/components/ChatList.tsx

```typescript
import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import styles from './ChatList.module.css';

interface ChatListProps {
  messages: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  //	 当消息列表变化时，自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatList} ref={listRef}>
      {messages.length === 0 ? (
        <div className={styles.empty}>暂无消息</div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
}
```

## 3. 样式文件：src/components/ChatList.module.css

```css
.chatList {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  scroll-behavior: smooth;
}

/* 自定义滚动条样式 */
.chatList::-webkit-scrollbar {
  width: 6px;
}

.chatList::-webkit-scrollbar-track {
  background: transparent;
}

.chatList::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.chatList::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}
```

## 4. 代码解析

### useRef 的使用
```typescript
const listRef = useRef<HTMLDivElement>(null);
```
- `useRef` 创建一个可变的 ref 对象
- `HTMLDivElement` 指定 ref 引用的 DOM 元素类型
- `null` 是初始值

### 自动滚动逻辑
```typescript
useEffect(() => {
  if (listRef.current) {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
}, [messages]);
```
- `useEffect` 监听 `messages` 变化
- `listRef.current` 获取 DOM 元素
- `scrollTop` 设置滚动位置
- `scrollHeight` 获取内容总高度
- 依赖数组 `[messages]` 确保消息变化时执行

### 条件渲染
```typescript
{messages.length === 0 ? (
  <div className={styles.empty}>暂无消息</div>
) : (
  messages.map((message) => (
    <MessageBubble key={message.id} message={message} />
  ))
)}
```
- 空状态显示提示
- 有消息时遍历渲染

### key 属性
```typescript
<MessageBubble key={message.id} message={message} />
```
- `key` 帮助 React 识别哪些元素改变了
- 必须使用唯一且稳定的值（如 `id`）
- 不要使用数组索引作为 key

## 5. 新概念：useRef 和 useEffect

### useRef
- 创建一个在组件生命周期内保持不变的引用
- 不会触发重新渲染
- 常用于：
  - 访问 DOM 元素
  - 保存定时器 ID
  - 保存上一次的值

### useEffect
- 处理副作用（如 DOM 操作、网络请求）
- 依赖数组决定何时执行：
  - `[]` - 只在组件挂载时执行一次
  - `[messages]` - messages 变化时执行
  - 不传 - 每次渲染都执行

## 6. 使用示例

```typescript
import { ChatList } from './components/ChatList';

function App() {
  const messages: Message[] = [
    { id: '1', role: 'user', content: '你好' },
    { id: '2', role: 'assistant', content: '你好！有什么我可以帮助你的吗？' }
  ];

  return <ChatList messages={messages} />;
}
```

## 7. 进阶优化（可选）

### 添加加载指示器
```typescript
interface ChatListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatList({ messages, isLoading = false }: ChatListProps) {
  return (
    <div className={styles.chatList} ref={listRef}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <div className={styles.loading}>AI 正在回复...</div>}
    </div>
  );
}
```

### 平滑滚动优化
```css
.chatList {
  scroll-behavior: smooth;  /* 平滑滚动 */
}
```

## 你的任务

根据案例，创建以下文件：
1. `src/components/ChatList.tsx`
2. `src/components/ChatList.module.css`

完成后告诉我，我帮你检查！