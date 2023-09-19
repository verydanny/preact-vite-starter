import fs from 'node:fs/promises'
import { createServer } from 'vite'
import { resolve } from './server.js'

import type { Context } from './server.js'

const __isTest = process.env.VITEST

interface ServerProps {
  root: string
  hmrPort?: number
}

export async function configureDevServer(
  app: import('express').Express,
  { root }: ServerProps
) {
  const vite = await createServer({
    root,
    logLevel: __isTest ? 'error' : 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: true,
    },
    appType: 'custom',
  })

  app.use(vite.middlewares)
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      const template = await vite.transformIndexHtml(
        url,
        await fs.readFile(resolve('../index.html'), { encoding: 'utf-8' })
      )

      const render = (await vite.ssrLoadModule('/src/entryServer.tsx')).render

      const context: Partial<Context> = {}
      const appHtml = render(url, context)
      
      if (context.url) {
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error as Error)
      console.log((error as Error).stack)
      res.status(500).end((error as Error).stack)
    }
  })

  return { app, vite }
}
