import { lazy, Suspense, useEffect, useState } from 'react'

const AnimatedBackground = lazy(() => import('./AnimatedBackground'))

const staticFallback = (
  <div
    className="pointer-events-none fixed inset-0 z-0 bg-black"
    aria-hidden
  />
)

/**
 * Defers the shard animation until the browser is idle so first paint / LCP stay fast.
 */
const LazyAnimatedBackground = () => {
  const [load, setLoad] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) setLoad(true)
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2000 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }

    const t = window.setTimeout(run, 600)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [])

  if (!load) return staticFallback

  return (
    <Suspense fallback={staticFallback}>
      <AnimatedBackground />
    </Suspense>
  )
}

export default LazyAnimatedBackground
