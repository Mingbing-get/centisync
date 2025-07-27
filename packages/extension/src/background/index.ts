import App from "@@/app"
import aiRouter from "./aiRoute"
import storeRouter from "./storeRoute"

const clientMap = new Map<string, App>()

chrome.runtime.onInstalled.addListener(() => {
  console.log('start')
})
chrome.runtime.onConnect.addListener((port) => {
  const app = new App(port)
  app.use(aiRouter.all())
  app.use(storeRouter.all())

  clientMap.set(port.name, app)

  port.onDisconnect.addListener(() => {
    clientMap.delete(port.name)
  })
})
