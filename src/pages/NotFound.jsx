import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimatedBackground from '../components/AnimatedBackground'

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-rage-black text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <FaExclamationTriangle className="text-9xl text-rage-yellow" />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 text-rage-yellow/20 blur-2xl"
              >
                <FaExclamationTriangle className="text-9xl" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-8xl sm:text-9xl font-rage text-rage-yellow mb-4"
            style={{
              textShadow: '4px 4px 0px #000000, -2px -2px 0px #feae11, 0 0 30px rgba(254, 174, 17, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-rage text-white mb-6"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed"
          >
            The page you're looking for has been smashed, broken, or destroyed!
            <br />
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(254, 174, 17, 0.8)",
                x: [0, -3, 3, -3, 3, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-rage-yellow text-rage-black font-rage py-4 px-8 rounded-full text-lg uppercase tracking-wider shadow-lg hover:shadow-2xl hover:shadow-rage-yellow/40 transition-all duration-300 border-2 border-rage-yellow hover:border-rage-yellow relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaHome className="text-xl" />
                Go Home
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
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(254, 174, 17, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="bg-transparent text-rage-yellow font-rage py-4 px-8 rounded-full text-lg uppercase tracking-wider border-2 border-rage-yellow hover:bg-rage-yellow/10 transition-all duration-300"
            >
              Go Back
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-rage-yellow/20"
          >
            <p className="text-gray-400 text-sm">
              Need help? <a href="/#contact" className="text-rage-yellow hover:text-rage-yellow/80 underline">Contact us</a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFound

