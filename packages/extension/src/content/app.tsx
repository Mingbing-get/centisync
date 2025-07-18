import React from 'react'
import ReactDom from 'react-dom/client'

import { AppProvider } from './context'
import Bar from './components/bar'

function AppUi() {
  return <Bar />
}

export default function render(root: HTMLElement) {
  ReactDom.createRoot(root).render(
    <React.StrictMode>
      <AppProvider name='content'>
        <AppUi />
      </AppProvider>
    </React.StrictMode>
  )
}
