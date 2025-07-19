import { useState } from 'react'
import { Modal, Popover } from '@arco-design/web-react'
import { IconSend } from '@arco-design/web-react/icon'

import Chat from '../chat'
import './index.scss'

interface Action {
  name: string
  icon: React.ReactNode
  render: React.ReactNode
}

interface Props {
  actions?: Action[]
}

export default function Bar({ actions }: Props) {
  const [chatVisible, setChatVisible] = useState(false)
  const [action, setAction] = useState<Action>()

  return (
    <div className='content-bar'>
      <span className='content-send' onClick={() => setChatVisible(true)}>
        <IconSend width={16} />
      </span>
      {
        actions?.length && (
          <div className='content-actions'>
            {
              actions.map(action => (
                <Popover
                  key={action.name}
                  content={action.name}
                  trigger='hover'
                  position='left'
                >
                  <div
                    className='content-action-item'
                    onClick={() => setAction(action)}
                  >{action.icon}</div>
                </Popover>
              ))
            }
          </div>
        )
      }
      <Modal
        visible={!!action}
        title={action?.name}
        footer={null}
        onCancel={() => setAction(undefined)}
      >
        {action?.render}
      </Modal>
      <Modal
        visible={chatVisible}
        style={{ minWidth: '60vw' }}
        title='centisync'
        footer={null}
        onCancel={() => setChatVisible(false)}
      >
        <Chat />
      </Modal>
    </div>
  )
}
