import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaShieldAlt, FaDoorOpen, FaTools } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import { ABOUT_IMAGE_FALLBACK, ABOUT_VIDEO_MP4 } from '../config/staticMedia'

const WhoWeAre = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, tHTML } = useTranslation()
  const [videoFailed, setVideoFailed] = useState(false)
  const videoSrc = ABOUT_VIDEO_MP4

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
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rage-black via-gray-950 to-gray-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(254,174,17,0.12)_0%,rgba(0,0,0,0)_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_55%)]" />
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
            className="w-24 h-1 bg-rage-yellow mx-auto mb-10 md:mb-14"
          />

          <motion.div
            variants={itemVariants}
            className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 order-2 lg:order-1 space-y-6 [&_strong]:text-rage-yellow [&_strong]:font-bold [&_strong.font-rage]:font-rage [&_strong.font-rage]:text-xl"
            >
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
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 order-1 lg:order-2 relative"
            >
              <motion.div 
                className="aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden border border-rage-yellow/20 shadow-2xl interactive-card bg-black/20 backdrop-blur-sm"
                whileHover={{ scale: 1.015, boxShadow: "0 0 55px rgba(254, 174, 17, 0.35)" }}
                transition={{ duration: 0.3 }}
              >
                {isInView && videoSrc && !videoFailed ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    className="w-full h-full object-cover"
                    onError={() => setVideoFailed(true)}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={ABOUT_IMAGE_FALLBACK}
                    alt={t('about.facilityImageAlt')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </motion.div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <motion.div 
                className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-rage-yellow/20 border border-rage-yellow/30 rounded-xl opacity-60 -z-10 float-animation backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 border border-white/10 rounded-2xl -z-10"
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
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
                    y: -6,
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.55), 0 10px 30px rgba(254, 174, 17, 0.18)",
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  className="bg-gray-900/60 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-rage-yellow/25 transition-all duration-300 group interactive-card rage-card-hover shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-rage-yellow/10 border border-rage-yellow/20 flex items-center justify-center shadow-[0_0_18px_rgba(254,174,17,0.15)]">
                        <IconComponent className={`${feature.color} text-2xl`} />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-rage text-rage-yellow leading-snug">{t(feature.titleKey)}</h3>
                      <p className="text-sm text-gray-300 mt-1 leading-relaxed">{t(feature.descriptionKey)}</p>
                    </div>
                  </div>
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


