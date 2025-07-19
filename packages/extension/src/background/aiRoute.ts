import { ChatClint } from '@centisync/core'

import Router from '@@/app/router'
import { getModelConfig, modelConfigIsComplete } from '@@/utils'

const aiRouter = new Router('/ai')

aiRouter
  .on<string>('/task', async (context) => {
    const modelConfig = await getModelConfig()
    if (!modelConfigIsComplete(modelConfig)) {
      context.send({
        code: -1,
        message: '模型未配置完整',
      })
      return
    }

    const clint = new ChatClint({
      modelConfig: {
        type: 'openai',
        ...modelConfig,
      },
    })

    await clint.createNext(context.data, {
      onStream: (data) => {
        context.app.send({
          id: context.messageId,
          route: '/ai/stream',
          data,
        })
      }
    })

    context.send({ code: 0, message: 'ok' })
  })

export default aiRouter
