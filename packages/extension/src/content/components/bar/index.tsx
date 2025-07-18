import { useCallback } from 'react'

import { useApp } from '../../context'

import './index.scss'

export default function Bar() {
  const app = useApp()

  const handleSend = useCallback(async () => {
    const res = await app.send<string, string>({ route: '/test/first', data: 'test' }, true)

    console.log(res)
  }, [])

  return <div className='content-bar' onClick={handleSend}>AI</div>
}
