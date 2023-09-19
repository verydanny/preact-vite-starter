import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

import { configureDevServer } from './configureDevServer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ISTEST = process.env.VITEST
const ISPROD = process.env.NODE_ENV === 'production'
const PORT = 5173

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertypoop'

export const resolve = (p: string) => path.resolve(__dirname, p)

export async function createServer(
  root: string = process.cwd(),
  hmrPort: number | undefined = undefined
) {
  const appEntry = express()
  // const indexProd = isProd
  //   ? await fs.readFile(resolve('../dist/client/index.html'), {
  //       encoding: 'utf-8',
  //     })
  //   : ''

  return configureDevServer(appEntry, { root, hmrPort })
}


if (!ISTEST) {
  if (!ISPROD) {
    createServer().then(({ app }) => {
      app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
      })
    })
  }
}