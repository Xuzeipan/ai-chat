import type { Message, Mode } from "../types";

/**
 * 获取发送给模型的上下文
 * @param messages - 历史消息列表
 * @param mode - 当前模式
 * @returns 上下文字符串
 */
function getContext(messages: Message[], mode: Mode): Message[] {
  const systemMessage: Message = {
    id: "system",
    role: "system",
    content: mode.systemPrompt,
  };

  // 获取最近n条对话
  const recentMessages = messages.slice(-mode.contextLength);

  return [systemMessage, ...recentMessages];
}

export default getContext;
