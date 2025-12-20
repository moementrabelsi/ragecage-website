import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (scrollPx / winHeight) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-rage-yellow/30 z-50">
      <motion.div
        className="h-full bg-rage-yellow rage-glow"
        style={{
          scaleX: scrollProgress / 100,
          transformOrigin: 'left',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  )
}

export default ScrollProgress

