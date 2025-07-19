import React from 'react'
import ReactDom from 'react-dom/client'

import App from './app'
import { AppProvider } from './context'

const root = document.createElement('div')
root.style = 'position: fixed; top: 50%; right: 0; transform: translate(0, -50%); z-index: 2147483647;'

document.body.appendChild(root)

ReactDom.createRoot(root).render(
  <React.StrictMode>
    <AppProvider name='content'>
      <App />
    </AppProvider>
  </React.StrictMode>
)
