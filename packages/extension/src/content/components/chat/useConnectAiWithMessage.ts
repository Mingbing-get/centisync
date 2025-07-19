import { useEffect, useRef, useState } from 'react'
import type { ChatClintNS } from '@centisync/core'
import { type ChatMessagesRef } from '@centisync/render-react'

import Router from '@@/app/router'
import { useApp } from '../../context'

export default function useConnectAiWithMessage() {
  const [running, setRunning] = useState(false)
  const chatMessagesRef = useRef<ChatMessagesRef>(null)
  
  const app = useApp()

  useEffect(() => {
    const aiRouter = new Router('/ai')
    aiRouter.on<ChatClintNS.StreamParams>('/stream', (context) => {
      chatMessagesRef.current?.appendStream(context.messageId, context.data)
    })

    const removeRouter = app.use(aiRouter.all())

    return () => {
      removeRouter()
    }
  })

  const sendMessage = async (message: string) => {
    if (!message) return

    const messageId = crypto.randomUUID()

    chatMessagesRef.current?.addMessage({
      id: crypto.randomUUID(),
      content: message,
      role: 'user'
    })
    chatMessagesRef.current?.addMessage({
      id: messageId,
      content: '',
      role: 'assistant',
      status: 'running'
    })
    setRunning(true)

    const res = await app.send<string, { code: number, message: string }>({
      id: messageId,
      route: '/ai/task',
      data: message
    }, true)

    setRunning(false)

    return res
  }

  return {
    running,
    chatMessagesRef,
    sendMessage
  }
}
