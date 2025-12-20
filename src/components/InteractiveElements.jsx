import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Magnetic button effect
export const useMagnetic = (strength = 0.3) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return {
    style: { transform: `translate(${position.x}px, ${position.y}px)` },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}

// Floating animation wrapper
export const FloatingElement = ({ children, delay = 0, duration = 6 }) => {
  return (
    <motion.div
      className="float-animation"
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Glitch text effect
export const GlitchText = ({ children, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.span
      className={`${className} ${isGlitching ? 'glitch-effect' : ''}`}
      animate={isGlitching ? { x: [0, -2, 2, -2, 2, 0] } : {}}
    >
      {children}
    </motion.span>
  )
}

// Particle burst on click
export const ParticleBurstButton = ({ children, onClick, className = '' }) => {
  const [particles, setParticles] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      angle: (i * 360) / 8,
    }))

    setParticles(newParticles)
    setTimeout(() => setParticles([]), 600)

    if (onClick) onClick(e)
  }

  return (
    <button onClick={handleClick} className={className} relative>
      {children}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-rage-yellow rounded-full pointer-events-none"
          initial={{ x: particle.x, y: particle.y, scale: 0 }}
          animate={{
            x: particle.x + Math.cos((particle.angle * Math.PI) / 180) * 50,
            y: particle.y + Math.sin((particle.angle * Math.PI) / 180) * 50,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </button>
  )
}

export default { useMagnetic, FloatingElement, GlitchText, ParticleBurstButton }











