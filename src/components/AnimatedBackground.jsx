import { useEffect, useRef, useState } from 'react'

const glassShardPaths = [
  'M 0,0 L 30,15 L 15,30 Z',
  'M 0,10 L 25,0 L 35,20 L 20,35 L 5,25 Z',
  'M 10,0 L 30,5 L 25,25 L 15,30 L 0,20 Z',
  'M 0,0 L 20,5 L 25,25 L 10,30 L 5,15 Z',
  'M 5,5 L 20,0 L 25,15 L 15,25 L 0,20 Z',
  'M 0,5 L 35,0 L 30,20 L 15,30 L 5,25 Z',
]

function createShards(count) {
  const list = []
  for (let i = 0; i < count; i++) {
    const pathIndex = Math.floor(Math.random() * glassShardPaths.length)
    list.push({
      id: i,
      path: glassShardPaths[pathIndex],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      opacity: 0.08 + Math.random() * 0.12,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      driftX: (Math.random() - 0.5) * 0.02,
      driftY: (Math.random() - 0.5) * 0.02,
      isYellow: Math.random() > 0.75,
      hasHighlight: Math.random() > 0.6,
    })
  }
  return list
}

function stepShards(prev) {
  return prev.map((shard) => {
    let newX = shard.x + shard.driftX
    let newY = shard.y + shard.driftY
    let newRotation = shard.rotation + shard.rotationSpeed
    if (newX < -5) newX = 105
    if (newX > 105) newX = -5
    if (newY < -5) newY = 105
    if (newY > 105) newY = -5
    if (newRotation >= 360) newRotation -= 360
    if (newRotation < 0) newRotation += 360
    return { ...shard, x: newX, y: newY, rotation: newRotation }
  })
}

/** Static backdrop — no main-thread animation loop */
function StaticBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,rgba(254,174,17,0.12)_0%,transparent_55%)]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
    </div>
  )
}

/**
 * Glass shards without Framer Motion and without 20Hz setState.
 * Updates are throttled via rAF (~8–14 fps) and shard count is lower on mobile.
 */
const AnimatedBackground = () => {
  const [shards, setShards] = useState([])
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)
  const shardsRef = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const count = mobile ? 10 : 26
    const minFrameMs = mobile ? 140 : 90

    const initial = createShards(count)
    shardsRef.current = initial
    setShards(initial)

    const tick = (now) => {
      if (!lastTickRef.current) lastTickRef.current = now
      const elapsed = now - lastTickRef.current
      if (elapsed >= minFrameMs) {
        lastTickRef.current = now
        shardsRef.current = stepShards(shardsRef.current)
        setShards(shardsRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onResize = () => {
      const m = window.matchMedia('(max-width: 767px)').matches
      const nextCount = m ? 10 : 26
      if (nextCount !== shardsRef.current.length) {
        const next = createShards(nextCount)
        shardsRef.current = next
        setShards(next)
      }
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return <StaticBackdrop />
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {shards.map((shard) => (
        <svg
          key={shard.id}
          viewBox="0 0 35 35"
          className="absolute"
          style={{
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            width: `${30 * shard.size}px`,
            height: `${30 * shard.size}px`,
            transform: `translate(-50%, -50%) rotate(${shard.rotation}deg)`,
            opacity: shard.opacity,
            mixBlendMode: 'screen',
          }}
        >
          <defs>
            <linearGradient id={`glassGradient-${shard.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {shard.isYellow ? (
                <>
                  <stop offset="0%" stopColor="rgba(254, 174, 17, 0.3)" />
                  <stop offset="100%" stopColor="rgba(254, 174, 17, 0.1)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
                  <stop offset="100%" stopColor="rgba(200, 200, 200, 0.1)" />
                </>
              )}
            </linearGradient>
          </defs>
          <path
            d={shard.path}
            fill={`url(#glassGradient-${shard.id})`}
            stroke={shard.isYellow ? 'rgba(254, 174, 17, 0.6)' : 'rgba(254, 174, 17, 0.4)'}
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          {shard.hasHighlight && (
            <circle cx="10" cy="10" r="3" fill="rgba(255, 255, 255, 0.3)" />
          )}
        </svg>
      ))}
    </div>
  )
}

export default AnimatedBackground
