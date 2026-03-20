import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Close mobile menu on scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  const navItems = [
    { name: t('nav.home'), to: 'home' },
    { name: t('nav.about'), to: 'about' },
    { name: t('nav.services'), to: 'services' },
    { name: t('nav.gallery'), to: 'gallery' },
    { name: t('nav.contact'), to: 'contact' },
  ]

  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    const target = document.getElementById(sectionId)
    if (!target) return

    const y = target.getBoundingClientRect().top + window.scrollY - 80
    window.history.replaceState(null, '', `#${sectionId}`)
    window.scrollTo({ top: y, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-rage-black/95 backdrop-blur-md shadow-[0_4px_20px_rgba(254,174,17,0.2)] border-b border-rage-yellow/15'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ 
              scale: 1.1,
              x: [0, -2, 2, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            className="flex-shrink-0"
          >
            <a
              href="#home"
              onClick={(event) => scrollToSection(event, 'home')}
              className="cursor-pointer flex items-center"
            >
              <img 
                src="/logo/rage-128.png"
                srcSet="/logo/rage-96.png 96w, /logo/rage-128.png 128w, /logo/rage-192.png 192w"
                sizes="(max-width: 640px) 96px, 128px"
                alt="Smash Room Logo"
                loading="eager" 
                fetchPriority="high"
                width={128}
                height={128}
                className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-24 w-auto min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px] object-contain bg-transparent"
                style={{ background: 'transparent' }}
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.to} whileHover={{ scale: 1.1, y: -2 }}>
                <a
                  href={`#${item.to}`}
                  onClick={(event) => scrollToSection(event, item.to)}
                  className="text-white hover:text-rage-yellow transition-colors duration-300 cursor-pointer font-crashcourse uppercase tracking-wider relative group text-sm md:text-base lg:text-lg magnetic rage-link-hover"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rage-yellow group-hover:w-full transition-all duration-300"></span>
                </a>
              </motion.div>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button and language switcher */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher isMobile={true} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Simple Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/98 backdrop-blur-md border-t border-rage-yellow/20">
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.to}
                  href={`#${item.to}`}
                  onClick={(event) => scrollToSection(event, item.to)}
                  className="block py-3 px-4 text-white hover:text-rage-yellow hover:bg-rage-yellow/10 transition-all duration-200 rounded-lg font-crashcourse uppercase tracking-wide text-sm rage-link-hover"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar


