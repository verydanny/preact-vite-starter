import { renderToString } from 'preact-render-to-string'
import { App } from './App'

export function render(url, context) {
  return renderToString(<App />, context)
}
