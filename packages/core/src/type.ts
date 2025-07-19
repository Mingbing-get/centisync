import { OpenAI } from "openai"

export namespace ChatClintNS {
  export interface OpenAIModelConfig {
    type: 'openai'
    url: string
    model: string
    apiKey: string
  }

  export type ModelConfig = OpenAIModelConfig

  export interface InstanceOptions {
    modelConfig: ChatClintNS.ModelConfig
    systemPrompt?: string
    toSummaryWhenContentOverLength?: number
    runTool?: RunTool
    onChangeStatus?: OnChangeStatus
    tools?: OpenAI.Chat.Completions.ChatCompletionTool[]
  }

  export interface StreamText {
    type: 'text',
    text: string,
    index: number
  }

  export interface StreamEnd {
    type: 'end'
    index: number
  }

  export type StreamParams = StreamText | StreamEnd

  export interface CreateNextOptions {
    onStream?: (info: StreamParams) => void
  }

  export type RunTool = (name: string, params: Record<string, any>) => Promise<any> | any

  export type OnChangeStatus = (status: Status) => void

  export type Status = 'free' | 'waitAi' | 'runTool' | 'summary'
}
