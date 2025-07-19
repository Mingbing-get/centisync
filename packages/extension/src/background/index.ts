import App from "@@/app"
import aiRouter from "./aiRoute"

chrome.runtime.onInstalled.addListener(() => {
  console.log('start')
})
chrome.runtime.onConnect.addListener((port) => {
  const app = new App(port)
  app.use(aiRouter.all())
})
