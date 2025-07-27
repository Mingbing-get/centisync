import { Switch } from '@arco-design/web-react'

import { ACCEPT_ALL } from '@@/const'
import { useBackgroundState } from '../../hooks'

export default function acceptAction() {
  const [acceptAll, setAcceptAll, loading] = useBackgroundState(ACCEPT_ALL, false)

  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <Switch
        loading={loading}
        size='small'
        checked={acceptAll}
        onChange={setAcceptAll}
        style={{ marginRight: 4 }}
      />
      接受所有
    </label>
  )
}
