import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import { useCloudinaryMedia } from '../hooks/useCloudinaryMedia'
import { cloudinaryImageUrl } from '../utils/cloudinary'

const Gallery = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const mobileStripRef = useRef(null)
  const [mobileScrollEdges, setMobileScrollEdges] = useState({
    left: false,
    right: false,
  })
  const { t } = useTranslation()
  const { items: galleryItems } = useCloudinaryMedia('gallery', 'image')

  const meta = [
    {
      titleKey: 'gallery.images.glassSmashing.title',
      descriptionKey: 'gallery.images.glassSmashing.description',
    },
    {
      titleKey: 'gallery.images.electronics.title',
      descriptionKey: 'gallery.images.electronics.description',
    },
    {
      titleKey: 'gallery.images.furniture.title',
      descriptionKey: 'gallery.images.furniture.description',
    },
    {
      titleKey: 'gallery.images.destruction.title',
      descriptionKey: 'gallery.images.destruction.description',
    },
    {
      titleKey: 'gallery.images.highEnergy.title',
      descriptionKey: 'gallery.images.highEnergy.description',
    },
    {
      titleKey: 'gallery.images.themed.title',
      descriptionKey: 'gallery.images.themed.description',
    },
    {
      titleKey: 'gallery.images.group.title',
      descriptionKey: 'gallery.images.group.description',
    },
  ]

  const fallbackImages = [
    '/images/gallery/1.jpg',
    '/images/gallery/2.jpg',
    '/images/gallery/3.jpg',
    '/images/gallery/4.jpg',
    '/images/gallery/5.jpg',
    '/images/gallery/6.jpg',
    '/images/gallery/7.jpg',
  ]

  const images =
    galleryItems.length > 0
      ? galleryItems.map((item, index) => {
          const metaItem = meta[index % meta.length]
          return {
            url:
              (item.publicId && cloudinaryImageUrl(item.publicId, { width: 1200 })) ||
              item.secureUrl ||
              fallbackImages[index % fallbackImages.length],
            titleKey: metaItem.titleKey,
            descriptionKey: metaItem.descriptionKey,
          }
        })
      : fallbackImages.map((url, index) => {
          const metaItem = meta[index % meta.length]
          return {
            url,
            titleKey: metaItem.titleKey,
            descriptionKey: metaItem.descriptionKey,
          }
        })

  useEffect(() => {
    const el = mobileStripRef.current
    if (!el) return

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      setMobileScrollEdges({
        left: scrollLeft > 8,
        right: scrollLeft < scrollWidth - clientWidth - 8,
      })
    }

    let scrollRaf = 0
    const onScrollThrottled = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        updateEdges()
      })
    }

    updateEdges()
    el.addEventListener('scroll', onScrollThrottled, { passive: true })
    const ro = new ResizeObserver(updateEdges)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScrollThrottled)
      ro.disconnect()
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
    }
  }, [images.length])

  const scrollMobileStrip = (direction) => {
    const el = mobileStripRef.current
    if (!el) return
    const card = el.querySelector('[data-gallery-card]')
    const gap = 16
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.88
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const hoverVibrate = {
    x: [0, -3, 3, -3, 3, 0],
    y: [0, -2, 2, -2, 2, 0],
    rotate: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }

  // Calculate visible images (3 at a time)
  const visibleImages = images.slice(currentIndex, currentIndex + 3)
  const maxIndex = Math.max(0, images.length - 3)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const handleImageClick = (index) => {
    // Find the actual index in the full images array
    const actualIndex = currentIndex + index
    setSelectedImageIndex(actualIndex)
  }

  const handleModalPrev = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleModalNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const modalTouchStartX = useRef(null)

  const handleModalTouchStart = (e) => {
    modalTouchStartX.current = e.touches[0].clientX
  }

  const handleModalTouchEnd = (e) => {
    if (modalTouchStartX.current == null) return
    const endX = e.changedTouches[0].clientX
    const dx = endX - modalTouchStartX.current
    modalTouchStartX.current = null
    if (Math.abs(dx) < 48) return
    setSelectedImageIndex((prev) => {
      if (prev === null) return prev
      const last = images.length - 1
      if (dx > 0) return prev === 0 ? last : prev - 1
      return prev === last ? 0 : prev + 1
    })
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-8 bg-gradient-to-b from-gray-900 to-rage-black">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-rage mb-4 text-rage-heading">
            <span className="text-rage-yellow">{t('gallery.titlePart1')}</span>
            <span className="text-white"> {t('gallery.titlePart2')}</span>
          </h2>
          <div className="w-24 h-1 bg-rage-yellow mx-auto"></div>
        </motion.div>

        {/* Mobile: horizontal touch scroll + arrow hints */}
        <div className="relative md:hidden -mx-4 px-4">
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Scroll gallery left"
                aria-disabled={!mobileScrollEdges.left}
                disabled={!mobileScrollEdges.left}
                onClick={() => scrollMobileStrip(-1)}
                className={`absolute left-1 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-rage-yellow text-rage-black shadow-lg transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  mobileScrollEdges.left ? 'opacity-100' : 'cursor-default opacity-40'
                }`}
              >
                <FaChevronLeft className="pointer-events-none text-xl" />
              </button>
              <button
                type="button"
                aria-label="Scroll gallery right"
                aria-disabled={!mobileScrollEdges.right}
                disabled={!mobileScrollEdges.right}
                onClick={() => scrollMobileStrip(1)}
                className={`absolute right-1 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-rage-yellow text-rage-black shadow-lg transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  mobileScrollEdges.right ? 'opacity-100' : 'cursor-default opacity-40'
                }`}
              >
                <FaChevronRight className="pointer-events-none text-xl" />
              </button>
            </>
          )}
          <div
            ref={mobileStripRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pl-10 pr-10 touch-pan-x overscroll-x-contain scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {images.map((image, index) => (
              <motion.div
                key={`gallery-mobile-${index}`}
                data-gallery-card
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ delay: Math.min(0.04 * index, 0.4), duration: 0.35 }}
                className="relative shrink-0 snap-center cursor-pointer overflow-hidden rounded-xl border border-rage-yellow/15 bg-gray-900/95 shadow-lg backdrop-blur-sm transition-transform min-w-[min(88vw,24rem)] max-w-[min(88vw,24rem)] active:scale-[0.99]"
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="pointer-events-none aspect-square overflow-hidden">
                  <img
                    src={image.url}
                    alt={t(image.titleKey)}
                    width={1200}
                    height={1200}
                    className="h-full w-full select-none object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop / tablet: 3-up carousel with arrows */}
        <div className="relative hidden md:block">
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous images"
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-40 bg-rage-yellow text-rage-black rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all pointer-events-auto"
            >
              <FaChevronLeft className="text-xl md:text-2xl" />
            </motion.button>
          )}

          {currentIndex < maxIndex && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next images"
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-40 bg-rage-yellow text-rage-black rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all pointer-events-auto"
            >
              <FaChevronRight className="text-xl md:text-2xl" />
            </motion.button>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleImages.map((image, index) => (
              <motion.div
                key={currentIndex + index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.08,
                  zIndex: 5,
                  boxShadow: '0 20px 40px rgba(254, 174, 17, 0.5)',
                  ...hoverVibrate,
                }}
                className="relative overflow-hidden rounded-xl border border-rage-yellow/15 hover:border-rage-yellow/30 transition-all duration-300 cursor-pointer group bg-gray-900/95 backdrop-blur-sm interactive-card rage-card-hover shadow-lg hover:shadow-2xl hover:shadow-rage-yellow/10"
                onClick={() => handleImageClick(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <motion.img
                    src={image.url}
                    alt={t(image.titleKey)}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    whileHover={{
                      scale: 1.3,
                      filter: 'brightness(1.2) contrast(1.2)',
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="absolute inset-0 bg-rage-yellow/0 group-hover:bg-rage-yellow/10 transition-colors duration-300"
                  animate={{
                    boxShadow: [
                      'inset 0 0 0 0 rgba(254, 174, 17, 0)',
                      'inset 0 0 50px 10px rgba(254, 174, 17, 0.2)',
                      'inset 0 0 0 0 rgba(254, 174, 17, 0)',
                    ],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${t('gallery.titlePart1')} ${t('gallery.titlePart2')}`}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-0 sm:p-4 overscroll-contain"
          onClick={() => setSelectedImageIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="relative flex h-full max-h-[100dvh] w-full max-w-7xl flex-col touch-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main image + swipe — fixed-height stage keeps arrow position stable when image aspect ratio changes */}
            <div
              className="relative flex min-h-0 flex-1 flex-col px-2 pb-2 pt-14 md:px-4 md:pb-10"
              onTouchStart={handleModalTouchStart}
              onTouchEnd={handleModalTouchEnd}
            >
              <div className="relative mx-auto w-full max-w-full flex-1 md:flex-none md:mx-auto md:w-full">
                <div className="relative h-[min(72vh,560px)] w-full md:h-[min(85vh,920px)]">
                  <button
                    type="button"
                    onClick={handleModalPrev}
                    aria-label="Previous image"
                    className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-rage-yellow text-rage-black shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black md:left-4 md:h-14 md:w-14"
                  >
                    <FaChevronLeft className="pointer-events-none text-xl md:text-3xl" />
                  </button>
                  <button
                    type="button"
                    onClick={handleModalNext}
                    aria-label="Next image"
                    className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-rage-yellow text-rage-black shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-4 md:h-14 md:w-14"
                  >
                    <FaChevronRight className="pointer-events-none text-xl md:text-3xl" />
                  </button>

                  <div className="flex h-full w-full items-center justify-center px-12 md:px-16">
                    <motion.img
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      src={images[selectedImageIndex].url}
                      alt={t(images[selectedImageIndex].titleKey)}
                      width={1200}
                      height={1200}
                      className="max-h-full max-w-full object-contain rounded-lg"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </div>

                  <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-center backdrop-blur-sm md:block">
                    <p className="text-xs text-gray-400">
                      {selectedImageIndex + 1} / {images.length}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedImageIndex(null)}
                aria-label="Close gallery"
                type="button"
                className="absolute right-3 top-3 z-[120] flex h-11 w-11 touch-manipulation items-center justify-center text-4xl leading-none text-white hover:text-rage-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-yellow md:right-4 md:top-4 md:h-12 md:w-12 md:text-5xl"
              >
                ×
              </button>
            </div>

            {/* Mobile: touch-scroll thumbnail strip */}
            <div className="flex-shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-md md:hidden">
              <div
                className="scrollbar-hide flex gap-2 overflow-x-auto snap-x snap-mandatory px-3 py-3 touch-pan-x overscroll-x-contain"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {images.map((img, i) => (
                  <button
                    key={`modal-thumb-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex(i)
                    }}
                    className={`relative h-16 w-16 shrink-0 snap-center overflow-hidden rounded-lg border-2 transition-opacity ${
                      i === selectedImageIndex
                        ? 'border-rage-yellow opacity-100'
                        : 'border-transparent opacity-60'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
              <p className="pb-3 text-center text-xs text-gray-400">
                {selectedImageIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Gallery


