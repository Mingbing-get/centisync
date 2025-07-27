import { IconSettings, IconTool } from '@arco-design/web-react/icon'

import Bar from './components/bar'
import Config from './components/config'

export default function App() {
  return <Bar actions={[
    { name: '模型配置', icon: <IconSettings width={16} />, render: <Config /> },
    { name: 'MCP配置', icon: <IconTool width={16} />, render: <span>todo</span> }
  ]} />
}
