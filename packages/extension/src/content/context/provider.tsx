import App from "@@/app"
import { useMemo, useRef } from "react"

import { appContext, AppContext } from "./base"

interface Props {
  name?: string
  children?: React.ReactNode
}

export default function AppProvider({ name, children }: Props) {
  const appRef = useRef(new App(chrome.runtime.connect({ name: name || crypto.randomUUID() })))

  const contextValue: AppContext = useMemo(() => ({
    app: appRef.current
  }), [])

  return <appContext.Provider value={contextValue}>{children}</appContext.Provider>
}
