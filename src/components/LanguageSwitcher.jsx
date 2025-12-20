import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { FaChevronDown } from 'react-icons/fa'
import GB from 'country-flag-icons/react/3x2/GB'
import FR from 'country-flag-icons/react/3x2/FR'

const LanguageSwitcher = ({ isMobile = false }) => {
  const { language, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', label: 'EN', name: 'English', Flag: GB },
    { code: 'fr', label: 'FR', name: 'Français', Flag: FR },
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-auto'}`} ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: isMobile ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 text-white hover:text-rage-yellow 
          transition-all duration-300
          ${isMobile ? 'justify-start w-full py-2.5 px-0' : 'justify-center py-2 px-3'}
        `}
        aria-label={currentLanguage.name}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <currentLanguage.Flag className="w-6 h-4 rounded-sm shadow-sm" />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <FaChevronDown className="text-xs flex-shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-[99] md:hidden backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
            )}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`
                absolute top-full mt-2 
                ${isMobile ? 'left-0 w-full' : 'right-0 w-auto'}
                bg-gray-900/95 backdrop-blur-md
                border border-rage-yellow/20 
                rounded-lg 
                shadow-2xl shadow-black/50
                overflow-hidden 
                z-[100] 
                min-w-[90px]
              `}
            >
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    backgroundColor: 'rgba(254, 174, 17, 0.15)',
                    x: 2
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center justify-center 
                    px-5 py-3.5 
                    transition-all duration-200 
                    font-bold uppercase 
                    text-sm sm:text-base
                    tracking-wider
                    touch-manipulation 
                    min-h-[48px]
                    relative
                    ${language === lang.code
                      ? 'bg-rage-yellow/15 text-rage-yellow'
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                  aria-label={lang.name}
                >
                  <lang.Flag className="w-7 h-5 rounded-sm shadow-sm mr-2" />
                  <span className="text-sm font-semibold">{lang.name}</span>
                  {language === lang.code && (
                    <motion.div
                      layoutId="activeLanguage"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-rage-yellow"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher

