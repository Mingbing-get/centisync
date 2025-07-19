import { useCallback, useState, useRef } from 'react'
import type { ChatClintNS } from '@centisync/core'

import { isUserMessage } from './utils'
import { Message, AssistantMessage, Tool, Status } from './type'

export default function useMessageManager(defaultMessages: Message[]) {
  const [messages, setMessages] = useState([...defaultMessages])
  const chunkCache = useRef<Record<string, { chunks: ChatClintNS.StreamParams[], content: string, index: number }>>({})

  const addMessage = useCallback((message: Message) => {
    setMessages(preMessage => [...preMessage, message])
  }, [])

  const updateMessageStatus = useCallback((messageId: string, status: Status) => {
    setMessages(preMessage => {
      const index = preMessage.findIndex(message => message.id === messageId)
      if (index === -1) return preMessage

      const newMessage = { ...preMessage[index], status }
      return [...preMessage.slice(0, index), newMessage, ...preMessage.slice(index + 1)]
    })
  }, [])

  const appendStream = useCallback((messageId: string, chunk: ChatClintNS.StreamParams) => {
    const cache = chunkCache.current[messageId] || { chunks: [], content: '', index: -1 }
    if (!chunkCache.current[messageId]) {
      chunkCache.current[messageId] = cache
    }
    let isEnd = false
    
    if (chunk.type === 'end') {
      isEnd = true
    } else {
      if (chunk.index !== cache.index + 1) {
        cache.chunks.push(chunk)
        return
      }

      cache.index = chunk.index
      cache.content += chunk.text
      while(true) {
        const nextChunkIndex = cache.chunks.findIndex(chunk => chunk.index === cache.index + 1)
        if (nextChunkIndex === -1) break

        const nextChunk = cache.chunks[nextChunkIndex]
        if (nextChunk.type === 'end') {
          isEnd = true
          break
        }

        cache.chunks.splice(nextChunkIndex, 1)
        cache.index = nextChunk.index
        cache.content += nextChunk.text
      }
    }

    if (isEnd) {
      delete chunkCache.current[messageId]
    }

    setMessages(preMessage => {
      const index = preMessage.findIndex(message => message.id === messageId)
      if (index === -1) return preMessage

      const newMessage = { ...preMessage[index], content: cache.content }

      if (isEnd && !isUserMessage(newMessage)) {
        newMessage.status = 'success'
      }

      return [...preMessage.slice(0, index), newMessage, ...preMessage.slice(index + 1)]
    })
  }, [])

  const appendTool = useCallback((messageId: string, tool: Omit<Tool, 'status'>) => {
    setMessages(preMessage => {
      const index = preMessage.findIndex(message => message.id === messageId)
      if (index === -1) return preMessage

      const currentMessage = preMessage[index]
      if (isUserMessage(currentMessage)) return preMessage

      const newMessage: AssistantMessage = { ...currentMessage, tools: [...(currentMessage.tools || []), { ...tool, status: 'wait' }] }
      return [...preMessage.slice(0, index), newMessage, ...preMessage.slice(index + 1)]
    })
  }, [])

  const updateToolStatus = useCallback((messageId: string, toolId: string, status: Status) => {
    setMessages(preMessage => {
      const index = preMessage.findIndex(message => message.id === messageId)
      if (index === -1) return preMessage

      const currentMessage = preMessage[index]
      if (isUserMessage(currentMessage)) return preMessage

      const tools = currentMessage.tools?.map(tool => {
        if (tool.id === toolId) {
          return { ...tool, status }
        }
        return tool
      })

      const newMessage: AssistantMessage = { ...currentMessage, tools }
      return [...preMessage.slice(0, index), newMessage, ...preMessage.slice(index + 1)]
    })
  }, [])

  return {
    messages,
    addMessage,
    updateMessageStatus,
    appendStream,
    appendTool,
    updateToolStatus
  }
}
