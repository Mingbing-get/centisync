import { Message, UserMessage, AssistantMessage } from './type'

export function isUserMessage(message: Message): message is UserMessage {
  return message.role === 'user'
}

export function isIAssistantMessage(message: Message): message is AssistantMessage {
  return message.role === 'assistant'
}