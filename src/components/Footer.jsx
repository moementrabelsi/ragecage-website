import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import logo from '../assets/logo/rage.png'

const Footer = () => {
  const { t } = useTranslation()
  const quickLinks = [
    { name: t('nav.home'), to: 'home' },
    { name: t('nav.about'), to: 'about' },
    { name: t('nav.services'), to: 'services' },
    { name: t('nav.gallery'), to: 'gallery' },
    { name: t('nav.contact'), to: 'contact' },
  ]

  const socialLinks = [
    { icon: FaFacebook, url: '#', color: 'hover:text-blue-500', label: 'Facebook' },
    { icon: FaInstagram, url: 'https://www.instagram.com/smashroomtn?igsh=d3RyamxnamkxcHht', color: 'hover:text-pink-500', label: 'Instagram' },
    { icon: FaTiktok, url: '#', color: 'hover:text-white', label: 'TikTok' },
    { icon: FaYoutube, url: '#', color: 'hover:text-red-500', label: 'YouTube' },
  ]

  const faqItems = [
    {
      questionKey: 'footer.faqItems.safety.question',
      answerKey: 'footer.faqItems.safety.answer'
    },
    {
      questionKey: 'footer.faqItems.items.question',
      answerKey: 'footer.faqItems.items.answer'
    },
    {
      questionKey: 'footer.faqItems.age.question',
      answerKey: 'footer.faqItems.age.answer'
    },
    {
      questionKey: 'footer.faqItems.duration.question',
      answerKey: 'footer.faqItems.duration.answer'
    },
    {
      questionKey: 'footer.faqItems.group.question',
      answerKey: 'footer.faqItems.group.answer'
    },
    {
      questionKey: 'footer.faqItems.clothing.question',
      answerKey: 'footer.faqItems.clothing.answer'
    },
  ]

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '12 Rue El Yasmina El Menzah 1, Tunis' },
    { icon: FaPhone, text: '(+216) 28 518 686' },
    { icon: FaEnvelope, text: 'smashroomtn@gmail.com' },
  ]

  return (
    <footer className="bg-rage-black border-t border-rage-yellow/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-4"
            >
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                className="cursor-pointer inline-block"
              >
                <img 
                  src={logo} 
                  alt="Smash Room Logo"
                  loading="lazy" 
                  className="h-12 w-auto object-contain bg-transparent"
                  style={{ background: 'transparent' }}
                />
              </Link>
            </motion.div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.description')}
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`text-2xl text-gray-400 ${social.color} transition-colors duration-300 rage-icon-hover`}
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-rage-yellow font-rage text-lg mb-4 uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="text-gray-400 hover:text-rage-yellow transition-colors duration-300 cursor-pointer text-sm font-semibold block magnetic rage-link-hover"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-rage-yellow font-rage text-lg mb-4 uppercase tracking-wider">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <motion.li
                  key={info.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 text-gray-400 text-sm"
                >
                  <info.icon className="text-rage-yellow text-lg mt-1 flex-shrink-0" />
                  <span>{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-rage-yellow font-rage text-lg mb-4 uppercase tracking-wider">
              {t('footer.faq')}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {faqItems.map((faq) => (
                <motion.details
                  key={faq.questionKey}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <summary className="text-gray-300 hover:text-rage-yellow cursor-pointer font-semibold text-sm mb-1 transition-colors duration-300 rage-link-hover">
                    {t(faq.questionKey)}
                  </summary>
                  <p className="text-gray-500 text-xs mt-2 ml-4 pl-2 border-l border-rage-yellow/20">
                    {t(faq.answerKey)}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-rage-yellow/15 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Smash Room. {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-rage-yellow transition-colors duration-300 rage-link-hover">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-gray-500 hover:text-rage-yellow transition-colors duration-300 rage-link-hover">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-gray-500 hover:text-rage-yellow transition-colors duration-300 rage-link-hover">
                {t('footer.safety')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


