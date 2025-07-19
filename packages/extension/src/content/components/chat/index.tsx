import React, { useState } from 'react'
import { Input, Button, Message as ArcoMessage, Empty } from '@arco-design/web-react'
import { IconSend } from '@arco-design/web-react/icon'
import { ChatMessagesRender } from '@centisync/render-react'

import useConnectAiWithMessage from './useConnectAiWithMessage'
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

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
      
      <div className="chat-input">
        <div className="input-container">
          <Input.TextArea
            placeholder="输入任务..."
            value={inputValue}
            onChange={setInputValue}
            onKeyDown={handleKeyPress}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
          <Button
            type="primary"
            shape="circle"
            size='small'
            icon={<IconSend />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || running}
            className="send-button"
          />
        </div>
      </div>
    </div>
  )
}
