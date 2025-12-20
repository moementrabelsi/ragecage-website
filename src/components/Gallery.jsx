import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'

const Gallery = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useTranslation()

  // Rage room gallery images - smashing, protective gear, action scenes
  const images = [
    {
      url: 'https://www.rageroomwreckit.be/gallery/thumb/img_36.jpg',
      titleKey: 'gallery.images.glassSmashing.title',
      descriptionKey: 'gallery.images.glassSmashing.description'
    },
    {
      url: 'https://www.rageroomwreckit.be/gallery/thumb/img_25.jpg',
      titleKey: 'gallery.images.electronics.title',
      descriptionKey: 'gallery.images.electronics.description'
    },
    {
      url: 'https://www.rageroomwreckit.be/gallery/thumb/img_24.jpg',
      titleKey: 'gallery.images.furniture.title',
      descriptionKey: 'gallery.images.furniture.description'
    },
    {
      url: 'https://images.squarespace-cdn.com/content/v1/64b80e5b1e8d1519429638e2/7afbb655-1b30-4db8-ba33-8355cc91aa15/Rage+Room+bats+and+clubs+.jpg?format=1500w',
      titleKey: 'gallery.images.destruction.title',
      descriptionKey: 'gallery.images.destruction.description'
    },
    {
      url: 'https://www.therageroom.nl/wp-content/uploads/2025/02/group-of-five-with-bats-under-red-led-lights-in-rage-room.jpeg',
      titleKey: 'gallery.images.highEnergy.title',
      descriptionKey: 'gallery.images.highEnergy.description'
    },
    {
      url: 'https://www.therageroom.nl/wp-content/uploads/2025/02/team-excitement-before-rage-room-experience.jpeg',
      titleKey: 'gallery.images.themed.title',
      descriptionKey: 'gallery.images.themed.description'
    },
    {
      url: 'https://www.therageroom.nl/wp-content/uploads/2025/02/two-people-in-safety-gear-posing-with-a-bat-and-crowbar-in-a-rage-room.jpg',
      titleKey: 'gallery.images.group.title',
      descriptionKey: 'gallery.images.group.description'
    }
  ]

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
          <p className="text-white/90 mt-4 text-lg font-semibold">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-40 bg-rage-yellow text-rage-black rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all pointer-events-auto"
            >
              <FaChevronRight className="text-xl md:text-2xl" />
            </motion.button>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {visibleImages.map((image, index) => (
              <motion.div
                key={currentIndex + index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.08, 
                  zIndex: 5,
                  boxShadow: "0 20px 40px rgba(254, 174, 17, 0.5)",
                  ...hoverVibrate
                }}
                className="relative overflow-hidden rounded-xl border border-rage-yellow/15 hover:border-rage-yellow/30 transition-all duration-300 cursor-pointer group bg-gray-900/95 backdrop-blur-sm min-w-full sm:min-w-0 snap-center sm:snap-none interactive-card shadow-lg hover:shadow-2xl hover:shadow-rage-yellow/10"
                onClick={() => handleImageClick(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <motion.img
                    src={image.url}
                    alt={t(image.titleKey)}
                    className="w-full h-full object-cover"
                    whileHover={{ 
                      scale: 1.3,
                      filter: "brightness(1.2) contrast(1.2)"
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="text-rage-yellow font-rage text-xl mb-2"
                      style={{ 
                        textShadow: '2px 2px 0px rgba(0,0,0,0.9), -1px -1px 0px rgba(254, 174, 17, 0.3), 0 0 10px rgba(254, 174, 17, 0.4)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {t(image.titleKey)}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-white font-semibold text-sm"
                    >
                      {t(image.descriptionKey)}
                    </motion.p>
                  </div>
                </div>
                {/* Impact effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-rage-yellow/0 group-hover:bg-rage-yellow/10 transition-colors duration-300"
                  animate={{
                    boxShadow: [
                      "inset 0 0 0 0 rgba(254, 174, 17, 0)",
                      "inset 0 0 50px 10px rgba(254, 174, 17, 0.2)",
                      "inset 0 0 0 0 rgba(254, 174, 17, 0)",
                    ]
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            <motion.button
              onClick={handleModalPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 md:left-8 bg-rage-yellow text-rage-black rounded-full p-4 md:p-5 shadow-lg hover:shadow-xl transition-all z-10"
            >
              <FaChevronLeft className="text-2xl md:text-3xl" />
            </motion.button>

            {/* Image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* Next Button */}
            <motion.button
              onClick={handleModalNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 md:right-8 bg-rage-yellow text-rage-black rounded-full p-4 md:p-5 shadow-lg hover:shadow-xl transition-all z-10"
            >
              <FaChevronRight className="text-2xl md:text-3xl" />
            </motion.button>

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
              <h3 className="text-rage-yellow font-rage text-xl md:text-2xl mb-2">
                {t(images[selectedImageIndex].titleKey)}
              </h3>
              <p className="text-white font-semibold text-sm md:text-base">
                {t(images[selectedImageIndex].descriptionKey)}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {selectedImageIndex + 1} / {images.length}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-4xl md:text-5xl hover:text-rage-yellow transition-colors rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Gallery


