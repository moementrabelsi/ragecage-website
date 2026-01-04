import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {
  const { t } = useTranslation()

  if (!bookingDetails) return null

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-rage-black border border-rage-yellow/30 rounded-lg shadow-xl max-w-lg w-full my-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
                aria-label="Close"
              >
                <FaTimes size={20} className="sm:w-5 sm:h-5" />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-rage font-black mb-4">
                  <span className="text-rage-yellow">{t('booking.confirmation.title1') || 'Booking'}</span>
                  <span className="text-white"> {t('booking.confirmation.title2') || 'Confirmed'}</span>
                </h2>
                
                <div className="space-y-3 sm:space-y-4 my-6 sm:my-8">
                  <div>
                    <p className="text-gray-400 text-sm sm:text-base mb-1">{t('booking.confirmation.date') || 'Date'}</p>
                    <p className="text-white font-semibold text-base sm:text-lg">
                      {formatDate(bookingDetails.date)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm sm:text-base mb-1">{t('booking.confirmation.time') || 'Time'}</p>
                    <p className="text-white font-semibold text-base sm:text-lg">
                      {formatTime(bookingDetails.timeSlot)}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 text-xs sm:text-sm mb-6">
                  {t('booking.confirmation.checkEmail') || 'Check your email for confirmation details'}
                </p>

                <button
                  onClick={onClose}
                  className="w-full bg-rage-yellow text-rage-black font-bold py-3 px-6 rounded hover:bg-yellow-500 active:bg-yellow-600 transition-colors touch-manipulation text-base sm:text-lg"
                >
                  {t('booking.confirmation.close') || 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookingConfirmationModal

