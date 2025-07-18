import App from '@@/app'
import { createContext } from 'react'

export interface AppContext {
  app?: App
}

export const appContext = createContext<AppContext>({})
