import { useState } from 'react'
import { Message as ArcoMessage, Empty } from '@arco-design/web-react'
import { ChatMessagesRender, ChatInput } from '@centisync/render-react'

import useConnectAiWithMessage from './useConnectAiWithMessage'
import AcceptAction from './AcceptAction'
import './index.scss'

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const { running, chatMessagesRef, sendMessage } = useConnectAiWithMessage()

  // 发送消息
  const handleSendMessage = async () => {
    const value = inputValue.trim()
    setInputValue('')

    const res = await sendMessage(value)
    if (!res) return

    if (res.code !== 0) {
      ArcoMessage.error(res.message)
    }
  }

  return (
    <div className="chat-container">
      <ChatMessagesRender
        style={{ flex: 1 }}
        ref={chatMessagesRef}
        emptyRender={
          <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Empty description="未开始任务" />
          </div>
        }
      />
      
      <ChatInput
        value={inputValue}
        running={running}
        onChange={setInputValue}
        onSend={handleSendMessage}
        actions={[
          <AcceptAction />
        ]}
        autoSize={{
          minRows: 1,
          maxRows: 4
        }}
      />
    </div>
  )
}
