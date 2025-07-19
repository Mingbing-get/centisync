import { OpenAI } from 'openai'

import { ChatClintNS } from "../type"

export default class ChatClint {
  private modelConfig: ChatClintNS.ModelConfig
  private runTool?: ChatClintNS.RunTool
  private onChangeStatus?: ChatClintNS.OnChangeStatus
  private beforeSummaryMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
  private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
  private status: ChatClintNS.Status = 'free'
  private toSummaryWhenContentOverLength = 100000

  readonly openai: OpenAI
  private tools: OpenAI.Chat.Completions.ChatCompletionTool[]

  constructor(option: ChatClintNS.InstanceOptions) {
    this.modelConfig = option.modelConfig
    this.tools = option.tools ? [...option.tools] : []
    this.runTool = option.runTool
    this.onChangeStatus = option.onChangeStatus
    if (option.toSummaryWhenContentOverLength) {
      this.toSummaryWhenContentOverLength = Math.max(option.toSummaryWhenContentOverLength, 1000)
    }
    if (option.systemPrompt) {
      this.messages.push({
        role: 'system',
        content: option.systemPrompt
      })
    }
    this.openai = new OpenAI({
      baseURL: option.modelConfig.url,
      apiKey: option.modelConfig.apiKey,
    })
  }

  clearTools() {
    this.tools.length = 0
    return this
  }

  resetTools(tools: OpenAI.Chat.Completions.ChatCompletionTool[]) {
    this.tools = [...tools]
    return this
  }

  appendTools(...tools: OpenAI.Chat.Completions.ChatCompletionTool[]) {
    tools.forEach(tool => {
      const oldToolIndex = this.tools.findIndex(oldTool => oldTool.function.name === tool.function.name)
      if (oldToolIndex !== -1) {
        this.tools.splice(oldToolIndex, 1, tool)
      } else {
        this.tools.push(tool)
      }
    })
    return this
  }

  removeTools(...toolNames: string[]) {
    this.tools = this.tools.filter(tool => !toolNames.includes(tool.function.name))
    return this
  }

  async createNext(prompt: string, option: ChatClintNS.CreateNextOptions = {}) {
    if (this.status !== 'free') throw new Error('当前正在执行任务，请等待任务执行完成')

    const beforeMessage = JSON.stringify(this.messages)
    if (beforeMessage.length > this.toSummaryWhenContentOverLength) {
      await this.summary()
    }

    this.messages.push({
      role: 'user',
      content: prompt
    })

    await this.runAi(option)
    this.changeStatus('free')
  }

  private async summary() {
    if (this.messages.length === 0) return

    this.changeStatus('summary')

    const res = await this.openai.chat.completions.create({
      model: this.modelConfig.model,
      messages: [...this.messages, { role: 'user', content: '用简短的语言总结之前所有的内容，注意保留关键信息。' }]
    })

    const content = res.choices[0]?.message?.content || ''
    const firstIsSystem = this.messages[0].role === 'system'
    const startCopyIndex = firstIsSystem ? 1 : 0
    this.beforeSummaryMessages.push(...this.messages.slice(startCopyIndex))
    this.messages.length = 0
    this.messages.push({
      role: 'system',
      content: `# 以下是之前对话的总结:\n\n${content}`
    })
  }

  private async runAi({ onStream }: ChatClintNS.CreateNextOptions) {
    this.changeStatus('waitAi')

    const stream = await this.openai.chat.completions.create({
      model: this.modelConfig.model,
      messages: this.messages,
      tools: this.tools,
      stream: true,
    })

    const tools: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta.ToolCall[] = []
    let content = ''
    let index = 0
    for await (const chunk of stream) {
      const toolCalls = chunk.choices[0]?.delta?.tool_calls
      if (toolCalls?.length) {
        tools.push(...toolCalls)
      }

      const deltaContent = chunk.choices[0]?.delta?.content
      if (deltaContent) {
        content += deltaContent
        onStream?.({
          type: 'text',
          text: deltaContent,
          index: index ++
        })
      }
    }

    onStream?.({
      type: 'end',
      index
    })

    this.messages.push({
      role: 'assistant',
      content,
      tool_calls: tools as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
    })

    if (tools.length === 0) return

    if (!this.runTool) {
      throw new Error('缺少执行tool的方法')
    }

    this.changeStatus('runTool')
    for (const tool of tools) {
      if (!tool?.function?.name) continue

      const result = await this.runTool(tool.function.name, JSON.parse(tool.function.arguments || '{}'))
      this.messages.push({
        role: 'tool',
        content: result,
        tool_call_id: tool.id || ''
      })
    }

    await this.runAi({ onStream })
  }

  private changeStatus(status: ChatClintNS.Status) {
    this.status = status
    this.onChangeStatus?.(status)
  }
}
