import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// SVG paths for different glass shard shapes
const glassShardPaths = [
  // Triangular shard
  'M 0,0 L 30,15 L 15,30 Z',
  // Irregular shard 1
  'M 0,10 L 25,0 L 35,20 L 20,35 L 5,25 Z',
  // Irregular shard 2
  'M 10,0 L 30,5 L 25,25 L 15,30 L 0,20 Z',
  // Sharp shard
  'M 0,0 L 20,5 L 25,25 L 10,30 L 5,15 Z',
  // Small fragment
  'M 5,5 L 20,0 L 25,15 L 15,25 L 0,20 Z',
  // Long shard
  'M 0,5 L 35,0 L 30,20 L 15,30 L 5,25 Z',
]

const AnimatedBackground = () => {
  const [shards, setShards] = useState([])

  useEffect(() => {
    const generateShards = () => {
      const newShards = []
      const numShards = 25 + Math.floor(Math.random() * 15) // 25-40 shards
      
      for (let i = 0; i < numShards; i++) {
        const pathIndex = Math.floor(Math.random() * glassShardPaths.length)
        newShards.push({
          id: i,
          path: glassShardPaths[pathIndex],
          x: Math.random() * 100, // Percentage of viewport width
          y: Math.random() * 100, // Percentage of viewport height
          size: 0.8 + Math.random() * 1.2, // 0.8x to 2x scale
          rotation: Math.random() * 360,
          opacity: 0.08 + Math.random() * 0.12, // 0.08-0.2 opacity
          rotationSpeed: (Math.random() - 0.5) * 0.3, // Slow rotation
          driftX: (Math.random() - 0.5) * 0.02, // Slow drift (percentage per frame)
          driftY: (Math.random() - 0.5) * 0.02,
          isYellow: Math.random() > 0.75, // Some yellow tinted
          hasHighlight: Math.random() > 0.6, // Some have highlights
        })
      }
      
      setShards(newShards)
    }

    generateShards()

    // Update animation
    const interval = setInterval(() => {
      setShards(prevShards => 
        prevShards.map(shard => {
          let newX = shard.x + shard.driftX
          let newY = shard.y + shard.driftY
          let newRotation = shard.rotation + shard.rotationSpeed

          // Wrap around edges
          if (newX < -5) newX = 105
          if (newX > 105) newX = -5
          if (newY < -5) newY = 105
          if (newY > 105) newY = -5
          if (newRotation >= 360) newRotation -= 360
          if (newRotation < 0) newRotation += 360

          return {
            ...shard,
            x: newX,
            y: newY,
            rotation: newRotation,
          }
        })
      )
    }, 50) // Update every 50ms

    // Regenerate on resize
    const handleResize = () => {
      generateShards()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shards.map((shard) => (
        <motion.svg
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
          initial={{ opacity: 0 }}
          animate={{ opacity: shard.opacity }}
          transition={{ duration: 1 }}
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
          {/* Highlight reflection */}
          {shard.hasHighlight && (
            <circle
              cx="10"
              cy="10"
              r="3"
              fill="rgba(255, 255, 255, 0.3)"
            />
          )}
        </motion.svg>
      ))}
    </div>
  )
}

export default AnimatedBackground











