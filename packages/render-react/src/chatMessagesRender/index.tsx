/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ForwardedRef } from 'react'
import classNames from 'classnames'
import { Button } from '@arco-design/web-react'
import { IconArrowDown } from '@arco-design/web-react/icon'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import useMessageManager from './useMessageManager'
import { Message, ChatMessagesRef, DefineTool, Tool } from './type'

import './index.scss'

interface Props {
  className?: string
  style?: React.CSSProperties
  defaultMessages?: Message[]
  emptyRender?: React.ReactNode
  tools?: DefineTool[]
}

function ChatMessagesRender({ defaultMessages = [], emptyRender, style, className, tools, }: Props, ref: ForwardedRef<ChatMessagesRef>) {
  const { messages, addMessage, updateMessageStatus, appendStream, appendTool, updateToolStatus } = useMessageManager(defaultMessages)
  const messageBoxRef = useRef<HTMLDivElement>(null)
  const needAutoScroll = useRef(true)

  useImperativeHandle(ref, () => ({
    addMessage,
    updateMessageStatus,
    appendStream,
    appendTool,
    updateToolStatus
  }), [])

  useEffect(() => {
    if (!needAutoScroll.current) return

    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!e.isTrusted) return

    const element = e.currentTarget
    const isToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1
    needAutoScroll.current = isToBottom
  }, [])

  return (
    <div ref={messageBoxRef} className={classNames("chat-messages", className)} style={style} onScroll={handleScroll}>
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
                    components={{
                      table: ({ node, ...props }) => (
                        <table style={{ borderCollapse: 'collapse', width: '100%' }} {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }} {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td style={{ border: '1px solid #ccc', padding: '8px' }} {...props} />
                      ),
                    }}
                  >{message.content}</ReactMarkdown>
                  {
                    message.tools?.map(tool => (
                      <ToolRender key={tool.id} tool={tool} tools={tools} />
                    ))
                  }
                </>
            }
          </div>
        ))
      }
    </div>
  )
}

export default forwardRef(ChatMessagesRender)

interface ToolRenderProps {
  tool: Tool
  tools?: DefineTool[]
}
function ToolRender({ tool, tools }: ToolRenderProps) {
  const [expand, isExpand] = useState(false)

  const defineTool = useMemo(() => {
    return tools?.find(item => item.name === tool.name)
  }, [tool.name, tools])

  return (
    <div className='chat-message-tool'>
      <div className='chat-message-tool-title'>
        <span>{defineTool?.title || tool.name}</span>
        <span className='chat-message-tool-title-actions'>
          <Button type='primary' size='mini'>接受</Button>
          <Button type='primary' status='danger' size='mini'>拒绝</Button>
          {
            defineTool?.Render && (
              <Button
                icon={<IconArrowDown rotate={expand ? 0 : 180} />}
                onClick={() => isExpand(!expand)} size='mini'
              />
            )
          }
        </span>
      </div>
      {
        defineTool?.Render && <div className={classNames('chat-message-tool-content', expand && 'is-expand')}>
          {
            <defineTool.Render params={tool.params} id={tool.id} status={tool.status} />
          }
        </div>
      }
    </div>
  )
}
