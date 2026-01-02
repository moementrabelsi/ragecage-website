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

              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-rage-yellow/20">
                <h2 className="text-xl sm:text-2xl font-rage font-black">
                  <span className="text-rage-yellow">{t('booking.confirmation.title1') || 'Booking'}</span>
                  <span className="text-white"> {t('booking.confirmation.title2') || 'Confirmed'}</span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  {t('booking.confirmation.subtitle') || 'Your rage room session has been successfully booked'}
                </p>
              </div>

              {/* Booking Details */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Date & Time */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-400 text-sm sm:text-base">{t('booking.confirmation.date') || 'Date'}:</span>
                    <span className="text-white font-medium text-sm sm:text-base break-words text-right sm:text-left">
                      {formatDate(bookingDetails.date)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-400 text-sm sm:text-base">{t('booking.confirmation.time') || 'Time'}:</span>
                    <span className="text-white font-medium text-sm sm:text-base text-right sm:text-left">
                      {formatTime(bookingDetails.timeSlot)}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="pt-4 border-t border-white/10 space-y-2 sm:space-y-3">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                    {t('booking.confirmation.customerDetails') || 'Customer Details'}
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm sm:text-base">{t('booking.firstName') || 'Name'}:</span>
                      <span className="text-white text-sm sm:text-base break-words text-right sm:text-left">
                        {bookingDetails.firstName} {bookingDetails.lastName}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm sm:text-base">{t('booking.email') || 'Email'}:</span>
                      <span className="text-white text-sm sm:text-base break-all text-right sm:text-left">
                        {bookingDetails.email}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm sm:text-base">{t('booking.phoneNumber') || 'Phone'}:</span>
                      <span className="text-white text-sm sm:text-base text-right sm:text-left">
                        {bookingDetails.phoneNumber}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm sm:text-base">{t('booking.groupSize') || 'Group Size'}:</span>
                      <span className="text-white text-sm sm:text-base text-right sm:text-left">
                        {bookingDetails.groupSize} {bookingDetails.groupSize === 1 ? t('booking.person') || 'person' : t('booking.people') || 'people'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {bookingDetails.specialRequests && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">{t('booking.specialRequests') || 'Special Requests'}:</p>
                    <p className="text-white text-xs sm:text-sm break-words">{bookingDetails.specialRequests}</p>
                  </div>
                )}

                {/* Email Notice */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-300 text-xs sm:text-sm break-words">
                    {t('booking.confirmation.checkEmail') || 'Check your email for booking details and instructions'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-rage-yellow/20">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-rage-yellow text-rage-black font-bold py-3 sm:py-2 px-4 rounded hover:bg-yellow-500 active:bg-yellow-600 transition-colors touch-manipulation text-sm sm:text-base"
                  >
                    {t('booking.confirmation.close') || 'Close'}
                  </button>
                  
                  <button
                    onClick={() => {
                      onClose()
                      window.location.href = '/'
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold py-3 sm:py-2 px-4 rounded border border-white/30 transition-colors touch-manipulation text-sm sm:text-base"
                  >
                    {t('booking.confirmation.backToHome') || 'Back to Home'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookingConfirmationModal

