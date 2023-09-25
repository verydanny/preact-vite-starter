import { renderToString } from 'preact-render-to-string'
import prepass from 'preact-ssr-prepass'
import { Router } from 'wouter-preact'
import { App } from './App'

export async function render(url: string, context: Record<string, unknown>) {
  const vDom = (
    <Router ssrPath={url}>
      <App />
    </Router>
  )

  await prepass(vDom)

  return renderToString(vDom)
}
