import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
      titleKey: 'services.rooms.glass.title',
      descriptionKey: 'services.rooms.glass.description',
      itemsKey: 'services.rooms.glass.items',
      image: '/images/services/4.jpg'
    },
    {
      id: 2,
      titleKey: 'services.rooms.electronics.title',
      descriptionKey: 'services.rooms.electronics.description',
      itemsKey: 'services.rooms.electronics.items',
      image: '/images/services/5.jpg'
    },
    {
      id: 3,
      titleKey: 'services.rooms.furniture.title',
      descriptionKey: 'services.rooms.furniture.description',
      itemsKey: 'services.rooms.furniture.items',
      image: '/images/services/6.jpg'
    },
    {
      id: 4,
      titleKey: 'services.rooms.themed.title',
      descriptionKey: 'services.rooms.themed.description',
      itemsKey: 'services.rooms.themed.items',
      image: '/images/services/7.jpg'
    },
    {
      id: 5,
      titleKey: 'services.rooms.extreme.title',
      descriptionKey: 'services.rooms.extreme.description',
      itemsKey: 'services.rooms.extreme.items',
      image: '/images/services/8.jpg'
    },
    {
      id: 6,
      titleKey: 'services.rooms.group.title',
      descriptionKey: 'services.rooms.group.description',
      itemsKey: 'services.rooms.group.items',
      image: '/images/services/9.jpg'
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
          {services.map(service => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.01,
                boxShadow: '0 15px 35px rgba(254,174,17,0.3)',
                transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              className="bg-gray-900/95 rounded-xl overflow-hidden border border-rage-yellow/15 shadow-lg flex flex-col rage-card-hover"
            >
              {/* IMAGE – UNCHANGED */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={service.image}
                  alt={t(service.titleKey)}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
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
                <p className="text-gray-300 leading-relaxed flex-1">
                  {t(service.descriptionKey)}
                </p>

                {/* BUTTON FIXED LEVEL */}
                <div className="mt-6 pt-2">
                  <ServiceButton serviceId={service.id} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesRooms
