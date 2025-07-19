import { getModelConfig, ModelConfig, saveModelConfig } from '@@/utils'
import { Input, Form } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'

import './index.scss'

const FormItem = Form.Item

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
    <div className='config-container'>
      <Form className='config-form' layout="vertical">
        <FormItem label="模型地址">
          <Input
            value={modelConfig.url}
            placeholder='请输入模型地址'
            onChange={v => handleUpdateModelConfig('url', v)}
            onBlur={handleBlur}
          />
        </FormItem>
        <FormItem label="模型名称">
          <Input
            value={modelConfig.model}
            placeholder='请输入模型名称'
            onChange={v => handleUpdateModelConfig('model', v)}
            onBlur={handleBlur}
          />
        </FormItem>
        <FormItem label="API Key">
          <Input
            value={modelConfig.apiKey}
            placeholder='请输入API Key'
            type='password'
            onChange={v => handleUpdateModelConfig('apiKey', v)}
            onBlur={handleBlur}
          />
        </FormItem>
      </Form>
    </div>
  )
}