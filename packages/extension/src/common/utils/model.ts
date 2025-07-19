import { MODEL_CONFIG } from "@@/const"

export interface ModelConfig {
  url: string
  model: string
  apiKey: string
}

export async function getModelConfig() {
  return new Promise<Partial<ModelConfig> | undefined>(resolve => {
    chrome.storage.local.get([MODEL_CONFIG], (result) => {
      resolve(result[MODEL_CONFIG])
    })
  })
}

export async function saveModelConfig(modelConfig: Partial<ModelConfig>) {
  return new Promise<void>(resolve => {
    chrome.storage.local.set({[MODEL_CONFIG]: modelConfig}, () => {
      resolve()
    })
  })
}

export async function removeModelConfig() {
  return new Promise<void>(resolve => {
    chrome.storage.local.remove([MODEL_CONFIG], () => {
      resolve()
    })
  })
}

export function modelConfigIsComplete(data?: Partial<ModelConfig>): data is ModelConfig {
  if (!data) return false

  return !!(data.apiKey && data.model && data.url)
}
