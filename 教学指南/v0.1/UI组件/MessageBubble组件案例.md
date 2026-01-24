# MessageBubble 组件案例

## 1. 组件文件：src/components/MessageBubble.tsx

```typescript
import type { Message } from '../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

## 2. 样式文件：src/components/MessageBubble.module.css

```css
.message {
  display: flex;
  margin-bottom: 16px;
  padding: 0 16px;
}

/* 用户消息靠右 */
.user {
  justify-content: flex-end;
}

/* AI 消息靠左 */
.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* 用户消息气泡 */
.user .bubble {
  background-color: #007aff;
  color: white;
  border-bottom-right-radius: 4px;
}

/* AI 消息气泡 */
.assistant .bubble {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}
```

## 3. 代码解析

### 组件部分
```typescript
// 导入类型和样式
import { Message } from '../types';
import styles from './MessageBubble.module.css';

// 定义 Props 接口
interface MessageBubbleProps {
  message: Message;
}

// 组件接收 message 作为 props
export function MessageBubble({ message }: MessageBubbleProps) {
  // 判断是否是用户消息
  const isUser = message.role === 'user';

  // 使用 CSS Modules
  // styles.message: 基础样式
  // styles[message.role]: 动态添加 .user 或 .assistant 类
  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

### 样式部分
```css
/* 基础容器 */
.message {
  display: flex;        /* 使用 flex 布局 */
  margin-bottom: 16pxp;  /* 消息间距 */
  padding: 0 16px;      /* 左右内边距 */
}

/* 用户消息靠右 */
.user {
  justify-content: flex-end;  /* flex 容器右对齐 */
}

/* AI 消息靠左 */
.assistant {
  justify-content: flex-start;  /* flex 容器左对齐 */
}

/* 气泡基础样式 */
.bubble {
  max-width: 70%;      /* 最大宽度 70% */
  padding: 12px 16px;  /* 内边距 */
  border-radius: 12px; /* 圆角 */
  line-height: 1.5;    /* 行高 */
  word-wrap: break-word; /* 长文本换行 */
}

/* 用户气泡样式 */
.user .bubble {
  background-color: #007aff;      /* 蓝色背景 */
  color: white;                   /* 白色文字 */
  border-bottom-right-radius: 4px; /* 右下角小圆角 */
}

/* AI 气泡样式 */
.assistant .bubble {
  background-color: #f0f0f0;      /* 灰色背景 */
  color: #333;                    /* 深色文字 */
  border-bottom-left-radius: 4px;  /* 左下角小圆角 */
}
```

## 4. CSS Modules 工作原理

```typescript
// CSS 文件中的类名
.user { justify-content: flex-end; }

// 编译后，styles 对象包含哈希后的类名
styles.user === 'MessageBubble_user__abc123'

// 在 JSX 中使用
<div className={styles[message.role]}>  // 动态获取类名

// 最终渲染的 HTML
<div class="MessageBubble_user__abc123">
```

## 5. 使用示例

```typescript
import { MessageBubble } from './components/MessageBubble';

function App() {
  const message: Message = {
    id: '1',
    role: 'user',
    content: '你好！'
  };

  return <MessageBubble message={message} />;
}
```

## 6. 进阶优化（可选）

### 添加时间戳
```typescript
interface MessageBubbleProps {
  message: Message;
  showTime?: boolean;  // 可选：是否显示时间
}

export function MessageBubble({ message, showTime = false }: MessageBubbleProps) {
  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.bubble}>
        {message.content}
      </div>
      {showTime && <div className={styles.time}>12:30</div>}
    </div>
  );
}
```

### 添加头像
```typescript
export function MessageBubble({ message }: MessageBubbleProps) {
  const avatar = message.role === 'user' ? '/user.png' : '/ai.png';

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <img src={avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.bubble}>
        {message.content}
      </div>
    </div>
  );
}
```

## 你的任务

根据案例，创建以下文件：
1. `src/components/MessageBubble.tsx`
2. `src/components/MessageBubble.module.css`

完成后告诉我，我帮你检查！