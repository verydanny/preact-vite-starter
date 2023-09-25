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
    million.vite({ mode: 'preact', server: ISSERVER, auto: true }),
    ISDEV && prefresh(),
    ISDEV && preactDevtoolsPlugin({ injectInProd: false, shouldTransform }),
  ],
  build: {
    target: 'esnext',
    minify: true,
    modulePreload: {
      polyfill: false
    },
    manifest: true,
  },
  esbuild: {
    jsx: 'automatic',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxImportSource: 'preact'
  },
})
