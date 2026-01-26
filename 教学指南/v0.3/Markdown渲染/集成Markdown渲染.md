# 集成 Markdown 渲染

## 基础实现

### 1. 修改 MessageBubble 组件

在 `MessageBubble.tsx` 中集成 MarkdownRenderer：

```typescript
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant} ${
        isSystem ? styles.system : ""
      }`}
    >
      <div className={styles.content}>
        {isSystem ? (
          // 系统消息显示为提示
          <div className={styles.systemTip}>{message.content}</div>
        ) : isUser ? (
          // 用户消息直接显示文本
          <span className={styles.userText}>{message.content}</span>
        ) : (
          // AI 消息使用 Markdown 渲染
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
```

### 2. 添加系统消息样式（可选）

在 `MessageBubble.module.css` 中添加：

```css
.system {
  opacity: 0.8;
}

.systemTip {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  padding: 8px 12px;
  background-color: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}
```

### 3. 测试渲染效果

尝试发送以下 Markdown 内容测试：

````markdown
# 这是一个标题

这是一段普通文本。

## 代码示例

```typescript
function hello() {
  console.log("Hello, World!");
}
```

## 列表

- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2

## 表格

| 名字 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |

> 这是一个引用块

[链接文本](https://example.com)
````

## 原理解释

1. **条件渲染** - 根据 `message.role` 判断显示方式
2. **样式隔离** - CSS Modules 确保样式不冲突
3. **组件复用** - MarkdownRenderer 可在多个地方使用

## 常见问题

### Q: 代码高亮不生效？

A: 确保已导入 highlight.js 的样式文件：
```typescript
import "highlight.js/styles/github-dark.css";
```

### Q: Markdown 内容显示乱码？

A: 检查 `marked.parse()` 返回的是否为字符串，可能需要转换类型。

### Q: XSS 安全问题？

A: 可以添加 DOMPurify 进行净化：
```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

```typescript
import DOMPurify from "dompurify";

// 在组件中
const sanitizedHtml = DOMPurify.sanitize(rawHtml);
```

## 你的任务

1. 修改 `MessageBubble.tsx`，集成 MarkdownRenderer
2. 添加必要的样式
3. 测试 Markdown 渲染效果
4. 测试代码高亮
5. 测试表格、列表、引用等功能
