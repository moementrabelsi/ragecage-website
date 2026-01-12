import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

const HeroCarousel = () => {
  const [isShaking, setIsShaking] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Rage room specific images - breaking, smashing, destruction
  const images = [
    'https://images.unsplash.com/photo-1612117750856-79d6b2ce3998?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Broken glass shards
    'https://images.unsplash.com/photo-1621434428956-5d9c872e607f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Destruction scene
    'https://www.therageroom.nl/wp-content/uploads/2025/02/group-of-five-with-bats-under-red-led-lights-in-rage-room.jpeg', // Smashing action
    'https://www.therageroom.nl/wp-content/uploads/2025/02/two-people-in-safety-gear-posing-with-a-bat-and-crowbar-in-a-rage-room.jpg', // High-energy destruction
  ]

  // Shaking animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      y: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    impact: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const slogan = "SMASH. BREAK. DESTROY. RELEASE."

  return (
    <div className="relative w-full h-screen overflow-hidden parallax-container">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-rage-yellow',
        }}
        loop={true}
        speed={1000}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <motion.img
                src={image}
                alt={`${t('booking.rageRoomAlt')} ${index + 1}`}
                className="w-full h-full object-cover"
                animate={isShaking ? {
                  scale: [1, 1.02, 1],
                  x: [0, -2, 2, -2, 2, 0],
                } : {}}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
              {/* Aggressive overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-rage-red/5 via-transparent to-rage-yellow/5"></div>
              {/* Subtle crack pattern overlay */}
              <div className="absolute inset-0 opacity-10 cracked-overlay"></div>
              
              {/* Slogan Overlay - Consistent on all slides */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center"
                >
                  <motion.h1
                    animate={isShaking ? shakeVariants.shake : {}}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-rage text-center mb-4 px-4 leading-tight text-rage-title"
                    style={{
                      letterSpacing: '0.15em',
                    }}
                  >
                    <motion.span
                      animate={{
                        textShadow: [
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                          '6px 6px 0px #000000, -3px -3px 0px #feae11',
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                        ]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="text-rage-yellow block"
                    >
                      {t('hero.smash')}
                    </motion.span>
                    <motion.span
                      animate={{
                        textShadow: [
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                          '6px 6px 0px #000000, -3px -3px 0px #feae11',
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                        ]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
                      className="text-white block"
                    >
                      {t('hero.break')}
                    </motion.span>
                    <motion.span
                      animate={{
                        textShadow: [
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                          '6px 6px 0px #000000, -3px -3px 0px #feae11',
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                        ]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                      className="text-rage-yellow block"
                    >
                      {t('hero.destroy')}
                    </motion.span>
                    <motion.span
                      animate={{
                        textShadow: [
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                          '6px 6px 0px #000000, -3px -3px 0px #feae11',
                          '4px 4px 0px #000000, -2px -2px 0px #feae11',
                        ]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                      className="text-rage-yellow block"
                    >
                      {t('hero.release')}
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 md:mb-8 font-black uppercase tracking-wider"
                    style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(254, 174, 17, 0.4)',
                    }}
                  >
                    {t('hero.subtitle')}
                  </motion.p>
                </motion.div>
                
                {/* Book Now Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 30px rgba(254, 174, 17, 0.8)",
                    x: [0, -3, 3, -3, 3, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    boxShadow: "0 0 20px rgba(254, 174, 17, 0.8)"
                  }}
                  onClick={() => navigate('/booking')}
                  className="bg-rage-yellow hover:bg-rage-yellow text-rage-black font-rage py-3 px-6 sm:py-4 sm:px-10 md:py-5 md:px-16 rounded-full text-sm sm:text-base md:text-xl lg:text-2xl rage-glow-intense transition-all duration-300 border-2 border-rage-yellow hover:border-rage-yellow uppercase tracking-wider sm:tracking-widest max-w-[90%] sm:max-w-none mx-auto relative overflow-hidden magnetic ripple-effect rage-button-hover group shadow-2xl hover:shadow-rage-yellow/40"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
                    {t('hero.bookButton')}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  {/* Ripple effect on click */}
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileTap={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroCarousel

