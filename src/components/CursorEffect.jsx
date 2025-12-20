import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    const handleMouseLeaveWindow = () => setIsVisible(false)

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseleave', handleMouseLeaveWindow)
    window.addEventListener('mouseenter', () => setIsVisible(true))

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseleave', handleMouseLeaveWindow)
      window.removeEventListener('mouseenter', () => setIsVisible(true))
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Cursor trail */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 1 : 0.7,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className="w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rage-yellow bg-rage-yellow/20" />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="fixed pointer-events-none z-40"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        animate={{
          scale: isHovering ? 3 : 1.5,
          opacity: isHovering ? 0.3 : 0.1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className="w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rage-yellow blur-xl" />
      </motion.div>
    </>
  )
}

export default CursorEffect

