import type { ChatClintNS } from '@centisync/core'

export type Status = 'wait' | 'running' | 'success' | 'failed'

export interface ToolRenderProps<T extends Record<string, any>> {
  id: string
  params: T
  status: Status
}

export interface DefineTool {
  name: string
  title: string
  Render?: <T extends Record<string, any>>(props: ToolRenderProps<T>) => React.ReactNode
}

export interface Tool {
  id: string,
  name: string,
  params: Record<string, any>
  status: Status
}

export interface UserMessage {
  id: string,
  role: 'user',
  content: string
}

export interface AssistantMessage {
  id: string,
  role: 'assistant',
  content: string,
  tools?: Tool[],
  status: Status
}

export type Message = UserMessage | AssistantMessage

export interface ChatMessagesRef {
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Status) => void;
  appendStream: (messageId: string, chunk: ChatClintNS.StreamParams) => void;
  appendTool: (messageId: string, tool: Omit<Tool, "status">) => void;
  updateToolStatus: (messageId: string, toolId: string, status: Status) => void;
}
