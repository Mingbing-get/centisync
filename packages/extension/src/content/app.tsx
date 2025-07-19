import { IconSettings, IconMessage } from '@arco-design/web-react/icon'

import Bar from './components/bar'
import Config from './components/config'

export default function App() {
  return <Bar actions={[
    { name: '模型配置', icon: <IconSettings width={16} />, render: <Config /> }
  ]} />
}
