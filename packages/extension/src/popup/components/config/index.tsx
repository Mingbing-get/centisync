import { getModelConfig, ModelConfig, saveModelConfig } from '@@/utils'
import { Input } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'

import './index.scss'

export default function Config() {
  const [modelConfig, setModelConfig] = useState<Partial<ModelConfig>>({})

  useEffect(() => {
    getModelConfig().then((info) => setModelConfig(info || {}))
  }, [])

  const handleUpdateModelConfig = useCallback(<K extends keyof ModelConfig>(key: K, v: ModelConfig[K]) => {
    setModelConfig(old => ({ ...old, [key]: v }))
  }, [])

  function handleBlur() {
    saveModelConfig(modelConfig)
  }

  return (
    <div className='config-form'>
      <Input
        value={modelConfig.url}
        placeholder='模型地址'
        onChange={v => handleUpdateModelConfig('url', v)}
        onBlur={handleBlur}
      />
      <Input
        value={modelConfig.model}
        placeholder='模型名称'
        onChange={v => handleUpdateModelConfig('model', v)}
        onBlur={handleBlur}
      />
      <Input
        value={modelConfig.apiKey}
        placeholder='API key'
        type='password'
        onChange={v => handleUpdateModelConfig('apiKey', v)}
        onBlur={handleBlur}
      />
    </div>
  )
}
