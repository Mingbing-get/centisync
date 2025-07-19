import path from "path"

import { vitePluginForArco } from '@arco-plugins/vite-react'
import { crx } from "@crxjs/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    vitePluginForArco(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true
      },
    }),
  ],
  resolve: {
    alias: {
      '@@': path.resolve(__dirname, './src/common')
    }
  },
  build: {
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/content.tsx'),
        popup: path.resolve(__dirname, 'src/popup/index.html')
      }
    }
  }
})
