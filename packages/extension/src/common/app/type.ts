import App from "."

export namespace PortApp {
  export interface Message<T> {
    id: string
    route: string
    data: T
  }

  export interface BaseContext<M> {
    app: App
    messageId: string
    data: M
    route: string
  }

  export interface MiddleWare<M = any, T extends {} = {}> {
    (context: BaseContext<M> & T, next: () => Promise<void>): Promise<void> | void
  }

  export type RouterMiddleWare<M = any, T extends {} = {}> = MiddleWare<M, T & { send: (data: any) => void }>
}
