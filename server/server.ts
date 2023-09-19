import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import express from 'express'

import { configureDevServer } from './configureDevServer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ISTEST = process.env.VITEST
const ISPROD = process.env.NODE_ENV === 'production'
const PORT = 5173

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertypoop'

export const resolve = (p: string) => path.resolve(__dirname, p)

export interface Context {
  url?: string
}

export async function createServer(
  root: string = process.cwd(),
  hmrPort: number | undefined = undefined
) {
  const app = express()

  if (!ISPROD) {
    return configureDevServer(app, { root, hmrPort })
  }

  app.use((await import('compression')).default())
  app.use(
    (await import('serve-static')).default(resolve('../dist/client'), {
      index: false,
    })
  )

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      const template = ISPROD
        ? await fs.readFile(resolve('../dist/client/index.html'), 'utf-8')
        : ''
      // @ts-expect-error
      const render = (await import('../dist/server/entryServer.js')).render
      const context: Context = {}
      const appHtml = render(url, context)

      if (context.url) {
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      console.log((error as Error).stack)
      res.status(500).end((error as Error).stack)
    }
  })

  return Promise.resolve({ app })
}

if (!ISTEST) {
  createServer().then(async ({ app }) => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
    })
  })
}
