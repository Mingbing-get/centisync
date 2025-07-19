import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import useMessageManager from './useMessageManager'
import { Message, ChatMessagesRef } from './type'

import './index.scss'

interface Props {
  className?: string
  style?: React.CSSProperties
  defaultMessages?: Message[]
  emptyRender?: React.ReactNode
}

function ChatMessagesRender({ defaultMessages = [], emptyRender, style, className }: Props, ref: ForwardedRef<ChatMessagesRef>) {
  const { messages, addMessage, updateMessageStatus, appendStream, appendTool, updateToolStatus } = useMessageManager(defaultMessages)

  useImperativeHandle(ref, () => ({
    addMessage,
    updateMessageStatus,
    appendStream,
    appendTool,
    updateToolStatus
  }), [])

  return (
    <div className={classNames("chat-messages", className)} style={style}>
      {messages.length === 0 && emptyRender}
      {
        messages.map(message => (
          <div
            className={classNames('chat-message', `role-${message.role}`)}
            key={message.id}
          >
            {
              message.role === 'user'
                ? message.content :
                <>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >{message.content}</ReactMarkdown>
                </>
            }
          </div>
        ))
      }
    </div>
  )
}

export default forwardRef(ChatMessagesRender)
