import type App from '@@/app'
import { useContext } from 'react'

import { appContext } from "./base"

export default function useApp() {
  const { app } = useContext(appContext)

  return app as App
}
