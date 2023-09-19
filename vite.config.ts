import { defineConfig } from 'vite'
import million from 'million/compiler'
import prefresh from '@prefresh/vite'

import { createFilter } from './config/utils.js'
import { preactDevtoolsPlugin } from './config/devtools.js'

const shouldTransform = createFilter([/\.[tj]sx?$/], [/node_modules/])
const ISDEV = process.env.NODE_ENV === 'development'
const ISSERVER = process.env.PLATFORM === 'server'

export default defineConfig({
  plugins: [
    million.vite({
      mode: ISSERVER ? 'preact' : 'preact-server',
      auto: { threshold: 0.01 },
      mute: true,
      server: ISSERVER,
    }),
    ISDEV && prefresh(),
    ISDEV && preactDevtoolsPlugin({ injectInProd: false, shouldTransform }),
  ],
  build: {
    target: ISSERVER ? 'esnext' : 'es2021',
    minify: ISSERVER ? false : 'terser',
    modulePreload: {
      polyfill: false,
    },
  },
  esbuild: {
    target: 'esnext',
    jsxDev: true,
    jsxFactory: 'h',
    jsxFragment: 'h',
    jsxImportSource: 'preact',
  },
})
