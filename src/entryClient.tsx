import { hydrate } from 'preact'
import { App } from './App'
import { Router } from 'wouter-preact'

const root = document.getElementById('app')

if (root) {
  hydrate(
    <Router>
      <App />
    </Router>,
    root
  )
}
