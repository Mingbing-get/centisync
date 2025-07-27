import { useCallback } from 'react'
import classNames from 'classnames'
import { Input, Button, TextAreaProps } from '@arco-design/web-react'
import { IconSend, IconRecordStop } from '@arco-design/web-react/icon'

import './index.scss'

interface Props extends TextAreaProps {
  running?: boolean
  onSend?: () => void
  onStop?: () => void
  actions?: React.ReactNode[]
}

export default function ChatInput({onSend, onStop, actions, running, className, style, ...textAreaProps}: Props) {
  const handleClick = useCallback(() => {
    if (running) {
      onStop?.()
    } else {
      onSend?.()
    }
  }, [onSend, onSend, running])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (running) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend?.()
    }
  }, [onSend, running])

  return (
    <div className={classNames("chat-input", className)} style={style}>
      <Input.TextArea onKeyDown={handleKeyDown} {...textAreaProps} />
      <div className='chat-input-actions'>
        <div className='chat-input-custom-actions'>
          {
            actions?.map((action, index) => <span className='chat-input-action' key={index}>{action}</span>)
          }
        </div>
        <Button
          type="primary"
          shape="circle"
          size='small'
          disabled={!textAreaProps.value}
          loading={running}
          icon={running ? <IconRecordStop /> : <IconSend />}
          onClick={handleClick}
          className="send-button"
        />
      </div>
    </div>
  )
}
