import { defineConfig } from 'vite'
import million from 'million/compiler'
import prefresh from '@prefresh/vite'

export default defineConfig({
  plugins: [
    million.vite({ mode: 'preact' }),
    prefresh()
  ],
  build: {
    minify: false,
  },
  esbuild: {
    target: 'esnext',
    jsxDev: true,
    jsxFactory: 'h',
    jsxFragment: 'h',
    jsxImportSource: 'preact'
  }
})
