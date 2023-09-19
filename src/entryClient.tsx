import { hydrate } from 'preact'
import { App } from './App'

const root = document.getElementById('app')

if (root) {
  hydrate(<App />, root)
}
