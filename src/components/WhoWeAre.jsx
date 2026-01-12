import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaShieldAlt, FaDoorOpen, FaTools } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'

const WhoWeAre = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, tHTML } = useTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rage-black to-gray-900">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-rage text-center mb-4 text-rage-heading"
          >
            <span className="text-rage-yellow">{t('about.titlePart1')}</span>
            <span className="text-white"> {t('about.titlePart2')} </span>
            <span className="text-rage-yellow">{t('about.titlePart3')}</span>
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-rage-yellow mx-auto mb-12"
          ></motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6 [&_strong]:text-rage-yellow [&_strong]:font-bold [&_strong.font-rage]:font-rage [&_strong.font-rage]:text-xl">
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg md:text-lg lg:text-lg text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={tHTML('about.paragraph1')}
              />
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg md:text-lg lg:text-lg text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={tHTML('about.paragraph2')}
              />
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg md:text-lg lg:text-lg text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={tHTML('about.paragraph3')}
              />
            </div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div 
                className="aspect-square rounded-xl overflow-hidden border-2 border-rage-yellow/20 shadow-2xl interactive-card"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(254, 174, 17, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://www.therageroom.nl/wp-content/uploads/2025/02/team-excitement-before-rage-room-experience.jpeg"
                  alt={t('about.facilityImageAlt')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-rage-yellow/20 border-2 border-rage-yellow/30 rounded-lg opacity-60 -z-10 float-animation backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16"
          >
            {[
              { 
                titleKey: 'about.features.safe.title',
                descriptionKey: 'about.features.safe.description', 
                icon: FaShieldAlt,
                color: 'text-rage-yellow'
              },
              { 
                titleKey: 'about.features.rooms.title',
                descriptionKey: 'about.features.rooms.description', 
                icon: FaDoorOpen,
                color: 'text-rage-yellow'
              },
              { 
                titleKey: 'about.features.equipment.title',
                descriptionKey: 'about.features.equipment.description', 
                icon: FaTools,
                color: 'text-rage-yellow'
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02, 
                    y: -6,
                    boxShadow: "0 10px 30px rgba(254, 174, 17, 0.25)",
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  className="bg-gray-800/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-rage-yellow/15 text-center hover:border-rage-yellow/30 transition-all duration-300 hover:bg-gray-800/80 group interactive-card rage-card-hover shadow-lg hover:shadow-2xl hover:shadow-rage-yellow/10"
                >
                  <div className="mb-4 flex justify-center">
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                      className={`${feature.color} text-5xl rage-icon-hover`}
                    >
                      <IconComponent />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-rage text-rage-yellow mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-gray-300">{t(feature.descriptionKey)}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhoWeAre


