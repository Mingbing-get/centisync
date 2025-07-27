import { useState, useCallback, useEffect } from "react"

import { useApp } from "../context"

export default function useBackgroundState<T>(key: string, initValue?: T): [T | undefined, (v: T) => Promise<void>, boolean] {
  const [value, _setValue] = useState(initValue)
  const [loading, setLoading] = useState(false)
  const app = useApp()

  const setValue = useCallback(async (value?: T) => {
    setLoading(true)
    await app.send<{ key: string, value?: T }, T>({
      route: '/store/saveState',
      data: {
        key,
        value
      }
    }, true)
    _setValue(value)
    setLoading(false)
  }, [])

  const getValue = useCallback(async () => {
    setLoading(true)
    const res = await app.send<string, T | undefined>({
      route: '/store/getState',
      data: key
    }, true)
    setLoading(false)

    if (res === undefined) return
    _setValue(res)
  }, [])

  useEffect(() => {
    getValue()
  }, [])

  return [value, setValue, loading]
}
