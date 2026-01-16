import { motion, useInView } from 'framer-motion'
import { useRef, useState, useMemo, useCallback } from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import emailjs from '@emailjs/browser'

// EmailJS configuration constants
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  { key: 'VITE_EMAILJS_SERVICE_ID', label: 'Service ID' },
  { key: 'VITE_EMAILJS_TEMPLATE_ID', label: 'Template ID' },
  { key: 'VITE_EMAILJS_PUBLIC_KEY', label: 'Public Key' },
]

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  // Check if EmailJS is configured
  const isEmailJSConfigured = useMemo(() => {
    return !!(EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID && EMAILJS_CONFIG.PUBLIC_KEY)
  }, [])

  // Get missing environment variables
  const missingEnvVars = useMemo(() => {
    return REQUIRED_ENV_VARS.filter(envVar => {
      const value = import.meta.env[envVar.key]
      return !value || value.trim() === ''
    })
  }, [])

  // Format error message for missing configuration
  const getConfigError = useCallback(() => {
    if (missingEnvVars.length === 0) return null
    
    const missingList = missingEnvVars.map(v => `• ${v.key} (${v.label})`).join('\n')
    return t('contact.error.configMissing', {
      missingVars: missingList,
      setupGuide: 'EMAILJS_SETUP.md',
      dashboardUrl: 'https://dashboard.emailjs.com/admin/account'
    })
  }, [missingEnvVars, t])

  // Format error message from EmailJS error
  const formatEmailJSError = useCallback((error) => {
    const errorText = error.text || error.message || ''
    const lowerError = errorText.toLowerCase()

    if (lowerError.includes('account not found') || lowerError.includes('404') || lowerError.includes('not found')) {
      return t('contact.error.accountNotFound')
    }
    if (lowerError.includes('public key') && (lowerError.includes('invalid') || lowerError.includes('incorrect'))) {
      return t('contact.error.invalidPublicKey')
    }
    if (lowerError.includes('service id') || (lowerError.includes('service') && lowerError.includes('invalid'))) {
      return t('contact.error.invalidServiceId')
    }
    if (lowerError.includes('template') && (lowerError.includes('invalid') || lowerError.includes('not found'))) {
      return t('contact.error.invalidTemplateId')
    }
    if (lowerError.includes('quota') || lowerError.includes('limit')) {
      return t('contact.error.quotaExceeded')
    }
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return t('contact.error.networkError')
    }

    return t('contact.error.generic', { details: errorText || t('contact.error.unknown') })
  }, [t])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    // Validate EmailJS configuration
    if (!isEmailJSConfigured) {
      setSubmitError(getConfigError())
      setSubmitting(false)
      return
    }

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || t('contact.phoneNotProvided'),
      message: formData.message,
      to_name: 'Smash Room',
    }

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      setSubmitSuccess(t('contact.success'))
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setSubmitError(formatEmailJSError(err))
    } finally {
      setSubmitting(false)
    }
  }, [formData, isEmailJSConfigured, getConfigError, formatEmailJSError, t])

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  // Memoized static data
  const socialLinks = useMemo(() => [
    { icon: FaFacebook, url: '#', color: 'hover:text-blue-500' },
    { icon: FaInstagram, url: 'https://www.instagram.com/smashroomtn?igsh=d3RyamxnamkxcHht', color: 'hover:text-pink-500' },
    { icon: FaTiktok, url: '#', color: 'hover:text-white' },
    { icon: FaYoutube, url: '#', color: 'hover:text-red-500' },
  ], [])

  const contactInfoItems = useMemo(() => [
    { icon: FaMapMarkerAlt, textKey: 'contact.address', isLink: false },
    { icon: FaPhone, textKey: 'contact.phone', isLink: true, linkType: 'tel' },
    { icon: FaEnvelope, textKey: 'contact.emailAddress', isLink: true, linkType: 'mailto' },
  ], [])


  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-8 bg-rage-black">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-rage mb-4 text-rage-heading">
            <span className="text-rage-yellow">{t('contact.titlePart1')}</span>
            <span className="text-white"> {t('contact.titlePart2')}</span>
          </h2>
          <div className="w-24 h-1 bg-rage-yellow mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-rage-yellow mb-4 md:mb-6">{t('contact.sendMessage')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.name')}
                  required
                  className="w-full px-4 py-3.5 bg-gray-900/80 backdrop-blur-sm border border-rage-yellow/15 rounded-lg text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all focus:ring-2 focus:ring-rage-yellow/20 focus:bg-gray-900"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.email')}
                  required
                  className="w-full px-4 py-3.5 bg-gray-900/80 backdrop-blur-sm border border-rage-yellow/15 rounded-lg text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all focus:ring-2 focus:ring-rage-yellow/20 focus:bg-gray-900"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('contact.phone')}
                  className="w-full px-4 py-3.5 bg-gray-900/80 backdrop-blur-sm border border-rage-yellow/15 rounded-lg text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all focus:ring-2 focus:ring-rage-yellow/20 focus:bg-gray-900"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.message')}
                  required
                  rows="5"
                  className="w-full px-4 py-3.5 bg-gray-900/80 backdrop-blur-sm border border-rage-yellow/15 rounded-lg text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all resize-none focus:ring-2 focus:ring-rage-yellow/20 focus:bg-gray-900"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.05,
                  x: [0, -2, 2, -2, 2, 0],
                  boxShadow: "0 0 25px rgba(254, 174, 17, 0.7)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  boxShadow: "0 0 15px rgba(254, 174, 17, 0.8)"
                }}
                disabled={submitting}
                className={`w-full font-rage py-4 px-8 rounded-xl transition-all duration-300 border-2 uppercase tracking-wider shadow-lg ${
                  submitting
                    ? 'bg-gray-700/50 border-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-rage-yellow hover:bg-rage-yellow text-rage-black border-rage-yellow hover:border-rage-yellow rage-glow rage-button-hover hover:shadow-xl hover:shadow-rage-yellow/30'
                }`}
              >
                {submitting ? t('contact.sending') : t('contact.sendButton')}
              </motion.button>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-700/30 border border-green-500 text-green-100 text-sm rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <div>{submitSuccess}</div>
                  </div>
                </motion.div>
              )}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-700/30 border border-red-500 text-red-100 text-sm rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">⚠</span>
                    <div className="flex-1">
                      <div className="font-semibold mb-2">{t('contact.error.title')}</div>
                      <div className="whitespace-pre-line text-xs leading-relaxed">{submitError}</div>
                      {!isEmailJSConfigured && missingEnvVars.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-red-600/50">
                          <div className="font-semibold mb-2 text-xs">{t('contact.error.requiredEnvVars')}</div>
                          <div className="bg-red-900/30 rounded p-2 font-mono text-xs">
                            {missingEnvVars.map((envVar, idx) => (
                              <div key={idx} className="mb-1">
                                {envVar.key}={'{your_value_here}'}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-xs opacity-90">
                            {t('contact.error.envHelp')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-rage-yellow mb-4 md:mb-6">{t('contact.getInTouch')}</h3>
              <div className="space-y-4">
                {contactInfoItems.map((info, index) => {
                  const IconComponent = info.icon
                  const text = t(info.textKey)
                  const href = info.isLink 
                    ? info.linkType === 'tel' 
                      ? `tel:${text.replace(/[\s()]/g, '')}` 
                      : `mailto:${text}`
                    : null
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 text-gray-300"
                    >
                      <IconComponent className="text-rage-yellow text-xl" />
                      {info.isLink ? (
                        <a 
                          href={href}
                          className="hover:text-rage-yellow transition-colors duration-300 rage-link-hover"
                        >
                          {text}
                        </a>
                      ) : (
                        <span>{text}</span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Social Media Icons */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-rage-yellow mb-4 md:mb-6">{t('contact.followUs')}</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-3xl text-gray-400 ${social.color} transition-colors duration-300 rage-icon-hover`}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Embedded Map */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-rage-yellow mb-4 md:mb-6">{t('contact.findUs')}</h3>
              <div className="rounded-xl overflow-hidden border border-rage-yellow/15 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d953.145176712118!2d10.179071170812556!3d36.84036095538615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDUwJzI0LjciTiAxMMKwMTAnNDUuNiJF!5e1!3m2!1sfr!2stn!4v1765151289612!5m2!1sfr!2stn"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact


