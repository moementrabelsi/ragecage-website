import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaUser,
  FaClock,
  FaBoxOpen,
  FaMusic,
  FaMoneyBillWave
} from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'

// Service Button Component
const ServiceButton = ({ serviceId }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <motion.button
      onClick={() => navigate('/booking')}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 20px rgba(254, 174, 17, 0.4)',
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: '0 0 15px rgba(254, 174, 17, 0.8)'
      }}
      className="w-full bg-rage-yellow text-rage-black font-rage py-4 px-6 rounded-lg border-2 border-rage-yellow uppercase tracking-wider shadow-lg rage-glow rage-button-hover relative overflow-hidden"
    >
      {t('services.bookButton')}
    </motion.button>
  )
}

const ServicesRooms = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()

  const services = [
    {
      id: 1,
      titleKey: 'services.rooms.soloBlast.title',
      descriptionKey: 'services.rooms.soloBlast.description',
      itemsKey: 'services.rooms.soloBlast.items',
      image: '/images/services/4.jpg'
    },
    {
      id: 2,
      titleKey: 'services.rooms.duoChaos.title',
      descriptionKey: 'services.rooms.duoChaos.description',
      itemsKey: 'services.rooms.duoChaos.items',
      image: '/images/services/5.jpg'
    },
    {
      id: 3,
      titleKey: 'services.rooms.trioMadness.title',
      descriptionKey: 'services.rooms.trioMadness.description',
      itemsKey: 'services.rooms.trioMadness.items',
      image: '/images/services/6.jpg'
    },
    {
      id: 4,
      titleKey: 'services.rooms.squadDestructionFour.title',
      descriptionKey: 'services.rooms.squadDestructionFour.description',
      itemsKey: 'services.rooms.squadDestructionFour.items',
      image: '/images/services/7.jpg',
      bestSeller: true
    },
    {
      id: 5,
      titleKey: 'services.rooms.squadDestructionFive.title',
      descriptionKey: 'services.rooms.squadDestructionFive.description',
      itemsKey: 'services.rooms.squadDestructionFive.items',
      image: '/images/services/8.jpg'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const getDetailIcon = (text) => {
    const lower = text.toLowerCase()

    if (lower.includes('person') || lower.includes('personne')) {
      return FaUser
    }
    if (lower.includes('minute')) {
      return FaClock
    }
    if (
      lower.includes('box') ||
      lower.includes('boîte') ||
      lower.includes('items') ||
      lower.includes('objets')
    ) {
      return FaBoxOpen
    }
    if (lower.includes('music') || lower.includes('musique')) {
      return FaMusic
    }
    if (lower.includes('price') || lower.includes('prix') || lower.includes('dt')) {
      return FaMoneyBillWave
    }

    return FaCheckCircle
  }

  return (
    <section className="py-16 px-4 bg-rage-black">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-rage text-rage-heading mb-4">
            <span className="text-rage-yellow">{t('services.titlePart1')}</span>
            <span className="text-white"> {t('services.titlePart2')} </span>
            <span className="text-rage-yellow">{t('services.titlePart3')}</span>
          </h2>
          <div className="w-24 h-1 bg-rage-yellow mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Top row: first 3 packs in the grid */}
          {services.slice(0, 3).map(service => {
            const description = t(service.descriptionKey)
            const [mainText, extrasRaw] = description.split('Extras:')
            const descriptionItems = mainText
              .split('•')
              .map(item => item.trim())
              .filter(Boolean)
            const extrasText = extrasRaw ? extrasRaw.trim() : ''
            const cardBorderClass = service.bestSeller
              ? 'border-2 border-rage-yellow shadow-[0_0_35px_rgba(254,174,17,0.6)]'
              : 'border border-rage-yellow/15 shadow-lg'

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                  boxShadow: '0 15px 35px rgba(254,174,17,0.3)',
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className={`bg-gray-900/95 rounded-xl overflow-hidden flex flex-col rage-card-hover ${cardBorderClass}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  {service.bestSeller && (
                    <div className="absolute top-3 right-3 bg-rage-yellow text-rage-black text-xs font-semibold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide">
                      {t('services.bestSeller')}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-3xl font-rage text-rage-yellow">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm text-white/80">
                      {t(service.itemsKey)}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1">
                  <ul className="text-gray-300 text-sm leading-relaxed space-y-1 flex-1">
                    {descriptionItems.map((item, idx) => {
                      const Icon = getDetailIcon(item)
                      return (
                        <li key={idx} className="flex items-start">
                          <Icon className="text-rage-yellow mr-2 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      )
                    })}
                    {extrasText && (
                      <li className="flex items-start pt-1">
                        <FaPlusCircle className="text-rage-yellow mr-2 mt-0.5" />
                        <span>
                          <span className="font-semibold">Extras:</span> {extrasText}
                        </span>
                      </li>
                    )}
                  </ul>

                  {/* BUTTON FIXED LEVEL */}
                  <div className="mt-6 pt-2">
                    <ServiceButton serviceId={service.id} />
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Bottom row: last 2 packs centered in a flex row */}
          <div className="lg:col-span-3 flex flex-col md:flex-row justify-center gap-8">
            {services.slice(3).map(service => {
              const description = t(service.descriptionKey)
              const [mainText, extrasRaw] = description.split('Extras:')
              const descriptionItems = mainText
                .split('•')
                .map(item => item.trim())
                .filter(Boolean)
              const extrasText = extrasRaw ? extrasRaw.trim() : ''
              const cardBorderClass = service.bestSeller
                ? 'border-2 border-rage-yellow shadow-[0_0_35px_rgba(254,174,17,0.6)]'
                : 'border border-rage-yellow/15 shadow-lg'

              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.01,
                    boxShadow: '0 15px 35px rgba(254,174,17,0.3)',
                    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  className={`bg-gray-900/95 rounded-xl overflow-hidden flex flex-col rage-card-hover md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] ${cardBorderClass}`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={service.image}
                      alt={t(service.titleKey)}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    {service.bestSeller && (
                      <div className="absolute top-3 right-3 bg-rage-yellow text-rage-black text-xs font-semibold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide">
                        {t('services.bestSeller')}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-3xl font-rage text-rage-yellow">
                        {t(service.titleKey)}
                      </h3>
                      <p className="text-sm text-white/80">
                        {t(service.itemsKey)}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="text-gray-300 text-sm leading-relaxed space-y-1 flex-1">
                      {descriptionItems.map((item, idx) => {
                        const Icon = getDetailIcon(item)
                        return (
                          <li key={idx} className="flex items-start">
                            <Icon className="text-rage-yellow mr-2 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        )
                      })}
                      {extrasText && (
                        <li className="flex items-start pt-1">
                          <FaPlusCircle className="text-rage-yellow mr-2 mt-0.5" />
                          <span>
                            <span className="font-semibold">Extras:</span> {extrasText}
                          </span>
                        </li>
                      )}
                    </ul>

                    {/* BUTTON FIXED LEVEL */}
                    <div className="mt-6 pt-2">
                      <ServiceButton serviceId={service.id} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesRooms
