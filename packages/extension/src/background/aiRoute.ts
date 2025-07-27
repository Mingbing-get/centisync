import { ChatClint } from '@centisync/core'

import Router from '@@/app/router'
import { getModelConfig, modelConfigIsComplete } from '@@/utils'

const chatClientMap = new Map<string, ChatClint>()
const aiRouter = new Router('/ai')

aiRouter
  .on<string>('/task', async (context) => {
    let clint = chatClientMap.get(context.app.port.name)
    if (!clint) {
      const modelConfig = await getModelConfig()
      if (!modelConfigIsComplete(modelConfig)) {
        context.send({
          code: -1,
          message: '模型未配置完整',
        })
        return
      }

      clint = new ChatClint({
        modelConfig: {
          type: 'openai',
          ...modelConfig,
        },
      })
      chatClientMap.set(context.app.port.name, clint)
    }

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
