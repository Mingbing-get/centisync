import Config from "./components/config"

import './app.scss'

export default function App() {
  return (
    <div className="popup-app">
      <h4 style={{ textAlign: 'center', margin: '8px 0' }}>欢迎使用 centisync</h4>
      <div style={{ backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 8 }}>
        <h4 style={{ margin: '0 0 8px', textAlign: 'center' }}>模型配置</h4>
        <Config />
      </div>
    </div>
  )
}
