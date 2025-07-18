import { PortApp } from "./type"

type SendMessage<T> = Omit<PortApp.Message<T>, 'id'> & Pick<Partial<PortApp.Message<T>>, 'id'>

export default class App {
  private middleWares: PortApp.MiddleWare[] = []
  private waitResponseMap: Record<string, (data: any) => void> = {}

  constructor(readonly port: chrome.runtime.Port) {
    this.bindMessage()
  }

  static IsValidateMessage(message: any): message is PortApp.Message<any> {
    if (Object.prototype.toString.call(message) !== '[object Object]') return false

    return typeof message.id === 'string' && typeof message.route === 'string'
  }

  use(middleWare: PortApp.MiddleWare) {
    this.middleWares.push(middleWare)

    return () => {
      const index = this.middleWares.findIndex(item => item === middleWare)
      if (index === -1) return

      this.middleWares.splice(index, 1)
    }
  }

  send<T>(info: SendMessage<T>, waitResponse?: false): undefined
  send<T, R>(info: SendMessage<T>, waitResponse: true): Promise<R>
  send<T, R>(info: SendMessage<T>, waitResponse?: boolean): Promise<R> | undefined {
    const requestId = info.id || crypto.randomUUID()

    this.port.postMessage({ ...info, id: requestId })

    if (!waitResponse) return

    return new Promise<R>(resolve => {
      this.waitResponseMap[requestId] = (data: R) => {
        delete this.waitResponseMap[requestId]

        resolve(data)
      }
    })
  }

  private bindMessage() {
    this.port.onMessage.addListener((message) => {
      if (!App.IsValidateMessage(message)) return

      this.waitResponseMap[message.id]?.(message.data)

      const context: PortApp.BaseContext<any> = {
        app: this,
        route: message.route,
        data: message.data,
        messageId: message.id
      }
      let current = 0

      const invokeMeddleWare = async () => {
        if (this.middleWares.length <= current) return

        const middleWare = this.middleWares[current]
        
        let executeNext = false
        const next = async () => {
          if (executeNext) {
            throw new Error('This method only run once!')
          }

          current ++
          executeNext = true
          await invokeMeddleWare()
        }

        await middleWare(context, next)
      }

      invokeMeddleWare()
    })
  }
}
