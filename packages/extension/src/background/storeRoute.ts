import Router from '@@/app/router'

const storeRouter = new Router('/store')

storeRouter
  .on<{ key: string, value: any }>('/saveState', async (context) => {
    if (context.data.value === undefined) {
      await chrome.storage.local.remove(context.data.key)
      context.send(undefined)
    } else {
      chrome.storage.local.set({ [context.data.key]: context.data.value }, () => {
        context.send(context.data.value)
      })
    }
  })
  .on<string>('/getState', (context) => {
    chrome.storage.local.get([context.data], (result) => {
      context.send(result[context.data])
    })
  })

export default storeRouter
