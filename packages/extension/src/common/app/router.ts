import { PortApp } from "./type"

export default class Router {
  private routeMap: Record<string, PortApp.RouterMiddleWare<any, any>> = {}
  
  constructor(private prefix: string = '') {}

  all(): PortApp.MiddleWare {
    return async (context, next) => {
      if (!context.route.startsWith(this.prefix)) return

      const afterRoute = context.route.substring(this.prefix.length)
      const fn = this.routeMap[afterRoute]
      if (!fn) return

      const send = (data: any) => {
        context.app.send({
          id: context.messageId,
          route: context.route,
          data
        })
      }
      await fn({ ...context, send }, next)
    }
  }

  on<M = any, T extends {} = {}>(route: string, fn: PortApp.RouterMiddleWare<M, T>) {
    this.routeMap[route] = fn

    return this
  }
}
