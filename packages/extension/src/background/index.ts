import App from "@@/app"
import Router from "@@/app/router"

const testRouter = new Router('/test')
testRouter
  .on<string>('/first', (context) => {
    console.log(context.data)

    context.send('来自background')
  })

chrome.runtime.onInstalled.addListener(() => {
  console.log('start')
})
chrome.runtime.onConnect.addListener((port) => {
  const app = new App(port)
  app.use(testRouter.all())
})
