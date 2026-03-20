import { useEffect, useRef, useState } from 'react'

const DeferredSection = ({ id, className = '', rootMargin = '300px 0px', children }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <section id={id} ref={ref} className={className}>
      {isVisible ? children : null}
    </section>
  )
}

export default DeferredSection
