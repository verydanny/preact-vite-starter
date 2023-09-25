import { useState } from 'preact/hooks'
import { Link, Route } from 'wouter-preact'
import { Suspense, lazy } from 'preact/compat'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = {
  Home: lazy(() => import('./pages/Home').then((m) => m.Home)),
  Items: lazy(() => import('./pages/Items').then((m) => m.Items)),
  Payment: lazy(() => import('./pages/Payment').then((m) => m.Payment)),
} as const

const routes = Object.keys(pages).map((page) => {
  const name = page as keyof typeof pages
  const component = pages[name]

  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component,
  }
})

export function App() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <>
      <nav>
        <ul>
          {routes.map(({ name, path }) => (
            <li key={path}>
              <Link to={path}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {routes.map(({ path, component }) => (
        <Suspense fallback={<div>Loading...</div>}>
          <Route key={path} path={path} component={component} />
        </Suspense>
      ))}
    </>
  )
}
