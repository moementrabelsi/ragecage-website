import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      if (ticking) return
      ticking = true

      window.requestAnimationFrame(() => {
        const scrollPx = document.documentElement.scrollTop
        const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = winHeight > 0 ? (scrollPx / winHeight) * 100 : 0
        setScrollProgress(prev => (Math.abs(prev - scrolled) < 0.5 ? prev : scrolled))
        ticking = false
      })
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()
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

