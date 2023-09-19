import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <>
    <h1>Count: { count }</h1>
    <button onClick={increment}>Click Me</button>
    </>
  )
}
