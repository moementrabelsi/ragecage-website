import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaUsers, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from '../hooks/useTranslation'
import logo from '../assets/logo/rage.png'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const Booking = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [groupSize, setGroupSize] = useState(1)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  
  // Current displayed month/year (defaults to current month)
  const today = new Date()
  const [displayMonth, setDisplayMonth] = useState(today.getMonth())
  const [displayYear, setDisplayYear] = useState(today.getFullYear())

  // Get current month and next month info
  const getCurrentMonthInfo = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let nextMonth = currentMonth + 1
    let nextYear = currentYear
    if (nextMonth > 11) {
      nextMonth = 0
      nextYear = currentYear + 1
    }
    
    return { currentMonth, currentYear, nextMonth, nextYear }
  }

  // Check if displayed month is selectable (current or next month only)
  const isMonthSelectable = (month, year) => {
    const { currentMonth, currentYear, nextMonth, nextYear } = getCurrentMonthInfo()
    return (
      (month === currentMonth && year === currentYear) ||
      (month === nextMonth && year === nextYear)
    )
  }

  // Get all days for a specific month (including previous/next month days for grid)
  const getCalendarDays = (month, year) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate()
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, prevMonthLastDay - i)
      days.push({ date, isCurrentMonth: false, isNextMonth: false })
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ date, isCurrentMonth: true, isNextMonth: false })
    }
    
    // Add next month's leading days to fill the grid (6 rows = 42 days)
    const totalDays = days.length
    const remainingDays = 42 - totalDays
    const nextMonthNum = month === 11 ? 0 : month + 1
    const nextYearNum = month === 11 ? year + 1 : year
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYearNum, nextMonthNum, day)
      days.push({ date, isCurrentMonth: false, isNextMonth: true })
    }
    
    return days
  }
  
  // Check if a date is Monday (day 1, where 0 = Sunday)
  const isMonday = (date) => {
    return date.getDay() === 1
  }

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  // Check if a date is selectable
  const isDateSelectable = (date, isCurrentMonth) => {
    if (!isCurrentMonth) return false
    if (isPastDate(date)) return false
    if (isMonday(date)) return false
    
    const { currentMonth, currentYear, nextMonth, nextYear } = getCurrentMonthInfo()
    const dateMonth = date.getMonth()
    const dateYear = date.getFullYear()
    
    return (
      (dateMonth === currentMonth && dateYear === currentYear) ||
      (dateMonth === nextMonth && dateYear === nextYear)
    )
  }

  const calendarDays = getCalendarDays(displayMonth, displayYear)

  // Generate time slots based on day of week
  // Tuesday-Friday: 11:00 to 22:00 (11h to 22h)
  // Saturday-Sunday: 10:00 to 22:00 (10h to 22h)
  const getTimeSlotsForDay = (dayOfWeek) => {
    const slots = []
    
    // Saturday (6) or Sunday (0): 10:00 to 22:00
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      for (let hour = 10; hour < 22; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
      // Add 22:00 slot
      slots.push('22:00')
    }
    // Tuesday (2) to Friday (5): 11:00 to 22:00
    else if (dayOfWeek >= 2 && dayOfWeek <= 5) {
      for (let hour = 11; hour < 22; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
      // Add 22:00 slot
      slots.push('22:00')
    }
    // Monday (1) or other days: no slots (closed)
    
    return slots
  }

  // Get time slots for selected date (or empty array if no date selected)
  const allTimeSlots = selectedDate ? getTimeSlotsForDay(selectedDate.getDay()) : []

  // Format time slot for display (09:00 -> 9:00 AM)
  const formatTimeSlot = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Format a Date as YYYY-MM-DD in local time to avoid UTC shifting
  const formatDateForApi = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Auto-update display month when current month changes
  useEffect(() => {
    const { currentMonth, currentYear } = getCurrentMonthInfo()
    // If displayed month is in the past, update to current month
    if (displayYear < currentYear || (displayYear === currentYear && displayMonth < currentMonth)) {
      setDisplayMonth(currentMonth)
      setDisplayYear(currentYear)
    }
  }, []) // Run once on mount and when month changes

  // Fetch available slots from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) {
        setAvailableSlots([])
        return
      }

      setLoading(true)
      setAvailabilityError(null)
      setSelectedTimeSlot(null) // Reset selected time when date changes

      try {
        // Format date as YYYY-MM-DD (local time to prevent day shift)
        const dateString = formatDateForApi(selectedDate)
        const response = await fetch(`${API_BASE_URL}/api/availability?date=${dateString}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch availability')
        }

        const data = await response.json()
        setAvailableSlots(data.available || [])
      } catch (err) {
        console.error('Error fetching availability:', err)
        setAvailabilityError('Failed to load available time slots. Please try again.')
        // Fallback: show all slots for the day as available if API fails
        const dayOfWeek = selectedDate.getDay()
        const fallbackSlots = getTimeSlotsForDay(dayOfWeek)
        setAvailableSlots(fallbackSlots)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [selectedDate])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Format month and year for display
  const formatMonthYear = (month, year) => {
    return new Date(year, month).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Check if can navigate to previous month
  const canNavigatePrev = () => {
    const { currentMonth, currentYear } = getCurrentMonthInfo()
    if (displayMonth === currentMonth && displayYear === currentYear) {
      return false // Already at current month
    }
    return true
  }

  // Check if can navigate to next month
  const canNavigateNext = () => {
    const { nextMonth, nextYear } = getCurrentMonthInfo()
    if (displayMonth === nextMonth && displayYear === nextYear) {
      return false // Already at next month
    }
    return true
  }

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (!canNavigatePrev()) return
    
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  // Navigate to next month
  const handleNextMonth = () => {
    if (!canNavigateNext()) return
    
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) return

    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim()) {
      setBookingError(t('booking.fillRequiredFields'))
      setBookingLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setBookingError(t('booking.invalidEmail'))
      setBookingLoading(false)
      return
    }

    // Validate phone number (exactly 8 digits, remove spaces)
    const phoneRegex = /^\d{8}$/
    const cleanedPhone = phoneNumber.trim().replace(/\s+/g, '')
    if (!phoneRegex.test(cleanedPhone)) {
      setBookingError('Phone number must be exactly 8 digits')
      setBookingLoading(false)
      return
    }

    setBookingLoading(true)
    setBookingError(null)
    setBookingSuccess(false)

    try {
      const dateString = formatDateForApi(selectedDate)
      
      const response = await fetch(`${API_BASE_URL}/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          timeSlot: selectedTimeSlot,
          groupSize: groupSize,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: cleanedPhone,
          email: email.trim(),
          specialRequests: specialRequests.trim(),
        }),
      })

      if (!response.ok) {
        // Try to parse error as JSON, fallback to status text
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // Response is not JSON (might be HTML error page)
          const text = await response.text()
          if (text.includes('<!DOCTYPE')) {
            errorMessage = 'Backend server error. Please check if the server is running on port 3001.'
          } else {
            errorMessage = text || errorMessage
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setBookingSuccess(true)
      
      // Reset form after successful booking
      setTimeout(() => {
        setSelectedDate(null)
        setSelectedTimeSlot(null)
        setGroupSize(1)
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setBookingSuccess(false)
        setAvailableSlots([])
      }, 3000)
    } catch (err) {
      console.error('Error creating booking:', err)
      let errorMessage = err.message || 'Failed to create booking. Please try again.'
      
      // Provide helpful error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 3001.'
      } else if (err.message.includes('404')) {
        errorMessage = 'Booking endpoint not found. Please check backend server configuration.'
      } else if (err.message.includes('permission') || err.message.includes('writer access') || err.message.includes('Calendar permission')) {
        errorMessage = 'Calendar permission error. The service account needs "Make changes to events" permission. Check backend/README.md for setup instructions.'
      }
      
      setBookingError(errorMessage)
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-rage-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-rage-black/95 backdrop-blur-md border-b border-rage-yellow/15 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white hover:text-rage-yellow transition-colors"
            >
              <FaArrowLeft />
              <span>{t('booking.backToHome')}</span>
            </button>
            <img src={logo} alt="Smash Room Logo" className="h-12 w-auto bg-transparent" style={{ background: 'transparent' }} />
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-8 md:py-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-rage font-black mb-4 text-rage-heading">
            <span className="text-rage-yellow">{t('booking.titlePart1')}</span>
            <span className="text-white"> {t('booking.titlePart2')}</span>
          </h1>
          <div className="w-24 h-1 bg-rage-yellow mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            {t('booking.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-rage-yellow/15 overflow-x-auto shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-rage-yellow text-xl sm:text-2xl" />
                  <h2 className="text-lg sm:text-2xl font-black text-rage-yellow">{t('booking.selectDate')}</h2>
                </div>
                
                {/* Month Navigation */}
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                  <motion.button
                    onClick={handlePrevMonth}
                    whileHover={canNavigatePrev() ? { scale: 1.1 } : {}}
                    whileTap={canNavigatePrev() ? { scale: 0.9 } : {}}
                    disabled={!canNavigatePrev()}
                    className={`
                      p-2 rounded-lg transition-all
                      ${canNavigatePrev()
                        ? 'bg-rage-yellow text-rage-black hover:bg-rage-yellow/90'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <FaChevronLeft className="text-sm sm:text-base" />
                  </motion.button>
                  
                  <h3 className="text-base sm:text-xl font-black text-white min-w-[150px] sm:min-w-[200px] text-center">
                    {formatMonthYear(displayMonth, displayYear)}
                  </h3>
                  
                  <motion.button
                    onClick={handleNextMonth}
                    whileHover={canNavigateNext() ? { scale: 1.1 } : {}}
                    whileTap={canNavigateNext() ? { scale: 0.9 } : {}}
                    disabled={!canNavigateNext()}
                    className={`
                      p-2 rounded-lg transition-all
                      ${canNavigateNext()
                        ? 'bg-rage-yellow text-rage-black hover:bg-rage-yellow/90'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <FaChevronRight className="text-sm sm:text-base" />
                  </motion.button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-gray-400 font-bold text-xs sm:text-sm py-1 sm:py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((dayInfo, index) => {
                  const { date, isCurrentMonth } = dayInfo
                  const day = date.getDate()
                  const isSelectedDay = isSelected(date)
                  const isTodayDate = isToday(date)
                  const isMondayDay = isMonday(date)
                  const isSelectable = isDateSelectable(date, isCurrentMonth)
                  const isDisabled = !isSelectable || isMondayDay
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => !isDisabled && setSelectedDate(date)}
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      disabled={isDisabled}
                      className={`
                        aspect-square rounded-lg font-bold transition-all duration-300 text-xs sm:text-sm md:text-base p-1 sm:p-0
                        ${!isCurrentMonth
                          ? 'bg-gray-950 border border-gray-900/30 text-gray-700 cursor-not-allowed opacity-40'
                          : isDisabled
                          ? 'bg-gray-900 border border-gray-800/30 text-gray-600 cursor-not-allowed opacity-50'
                          : isSelectedDay 
                          ? 'bg-rage-yellow border-2 border-rage-yellow/50 text-rage-black shadow-lg shadow-rage-yellow/40' 
                          : isTodayDate
                          ? 'bg-rage-yellow/15 border border-rage-yellow/30 text-rage-yellow'
                          : 'bg-gray-800 border border-gray-700/30 text-gray-300 hover:border-rage-yellow/20'
                        }
                      `}
                      title={
                        !isCurrentMonth 
                          ? t('booking.notAvailable')
                          : isMondayDay 
                          ? t('booking.closedMondays')
                          : isPastDate(date)
                          ? t('booking.pastDate')
                          : ''
                      }
                    >
                      {day}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Time Slots Section */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-rage-yellow/15 mt-6 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
                  <FaClock className="text-rage-yellow text-xl sm:text-2xl" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-rage-yellow">
                    {t('booking.availableSlots')} - {formatDate(selectedDate)}
                  </h2>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rage-yellow"></div>
                    <p className="text-gray-400 mt-4">{t('booking.loading')}</p>
                  </div>
                )}

                {availabilityError && !loading && (
                  <div className="bg-rage-yellow/15 border border-rage-yellow/30 rounded-xl p-4 mb-4 backdrop-blur-sm">
                    <p className="text-rage-yellow text-sm">{availabilityError}</p>
                  </div>
                )}

                {!loading && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {allTimeSlots.map((slot, index) => {
                      const isAvailable = availableSlots.includes(slot)
                      const isSelected = selectedTimeSlot === slot
                      
                      return (
                        <motion.button
                          key={index}
                          onClick={() => isAvailable && setSelectedTimeSlot(slot)}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          disabled={!isAvailable}
                          className={`
                            w-full h-16 sm:h-20 md:h-20 px-2 sm:px-4 rounded-lg font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex flex-col items-center justify-center
                            ${isSelected
                              ? 'bg-rage-yellow border-2 border-rage-yellow text-rage-black shadow-lg shadow-rage-yellow/40'
                              : isAvailable
                              ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 text-gray-300 hover:border-rage-yellow/40 hover:bg-gray-800'
                              : 'bg-gray-900/50 border border-gray-800/30 text-gray-600 cursor-not-allowed opacity-50'
                            }
                          `}
                        >
                          <span>{formatTimeSlot(slot)}</span>
                          {!isAvailable && (
                            <span className="text-xs mt-0.5 font-normal">{t('booking.unavailable')}</span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-rage-yellow/15 sticky top-24 shadow-lg"
            >
              <h2 className="text-2xl font-black text-rage-yellow mb-6">{t('booking.bookingDetails')}</h2>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-xl font-black text-rage-yellow mb-4">{t('booking.customerInfo')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      {t('booking.firstName')} <span className="text-rage-yellow">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('booking.enterFirstName')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700/30 text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      {t('booking.lastName')} <span className="text-rage-yellow">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('booking.enterLastName')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700/30 text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      {t('booking.phoneNumber')} <span className="text-rage-yellow">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        // Only allow digits and spaces, limit to 8 digits
                        const value = e.target.value.replace(/[^\d\s]/g, '').slice(0, 12)
                        setPhoneNumber(value)
                      }}
                      placeholder="12345678"
                      maxLength={12}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700/30 text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      {t('booking.email')} <span className="text-rage-yellow">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700/30 text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      {t('booking.specialRequests')}
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder={t('booking.specialRequestsPlaceholder')}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 text-white placeholder-gray-500 focus:border-rage-yellow/40 focus:outline-none transition-all resize-none focus:ring-2 focus:ring-rage-yellow/20"
                    />
                  </div>
                </div>
              </div>

              {/* Group Size Selector */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUsers className="text-rage-yellow text-xl" />
                  <label className="text-white font-bold">{t('booking.groupSize')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    disabled={groupSize === 1}
                    className="w-10 h-10 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 text-white font-bold hover:border-rage-yellow/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-black text-rage-yellow">{groupSize}</span>
                    <span className="text-gray-400 text-sm block">{groupSize === 1 ? t('booking.person') : t('booking.people')}</span>
                  </div>
                  <button
                    onClick={() => setGroupSize(Math.min(4, groupSize + 1))}
                    disabled={groupSize === 4}
                    className="w-10 h-10 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 text-white font-bold hover:border-rage-yellow/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-2 text-center">{t('booking.maxPeople')}</p>
              </div>

              {/* Booking Summary */}
              <div className="space-y-4 mb-6">
                <div className="border-t border-gray-700/30 pt-4">
                  <div className="text-gray-400 text-sm mb-2">{t('booking.selectedDate')}</div>
                  <div className="text-white font-bold">
                    {selectedDate ? formatDate(selectedDate) : t('booking.notSelected')}
                  </div>
                </div>
                <div className="border-t border-gray-700/30 pt-4">
                  <div className="text-gray-400 text-sm mb-2">{t('booking.timeSlot')}</div>
                  <div className="text-white font-bold">
                    {selectedTimeSlot ? formatTimeSlot(selectedTimeSlot) : t('booking.notSelected')}
                  </div>
                </div>
                <div className="border-t border-gray-700/30 pt-4">
                  <div className="text-gray-400 text-sm mb-2">{t('booking.groupSize')}</div>
                  <div className="text-white font-bold">{groupSize} {groupSize === 1 ? 'person' : 'people'}</div>
                </div>
              </div>

              {/* Success Message */}
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rage-yellow/20 border-2 border-rage-yellow rounded-lg p-4 mb-4"
                >
                  <p className="text-rage-yellow font-bold text-center">
                    ✓ {t('booking.success')}
                  </p>
                </motion.div>
              )}

              {/* Error Message */}
              {bookingError && !bookingLoading && (
                <div className="bg-rage-yellow/20 border-2 border-rage-yellow rounded-lg p-4 mb-4">
                  <p className="text-rage-yellow text-sm">{bookingError}</p>
                </div>
              )}

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirmBooking}
                whileHover={!bookingLoading && selectedDate && selectedTimeSlot && firstName && lastName && phoneNumber && email ? { scale: 1.05 } : {}}
                whileTap={!bookingLoading && selectedDate && selectedTimeSlot && firstName && lastName && phoneNumber && email ? { scale: 0.95 } : {}}
                disabled={!selectedDate || !selectedTimeSlot || !firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim() || bookingLoading}
                  className={`
                  w-full py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wide transition-all duration-300
                  ${selectedDate && selectedTimeSlot && firstName.trim() && lastName.trim() && phoneNumber.trim() && email.trim() && !bookingLoading
                    ? 'bg-rage-yellow border-2 border-rage-yellow text-rage-black hover:bg-rage-yellow/90 shadow-lg hover:shadow-xl hover:shadow-rage-yellow/30'
                    : 'bg-gray-800/50 border border-gray-700/30 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {t('booking.creating')}
                  </span>
                ) : (
                  t('booking.confirmButton')
                )}
              </motion.button>

              {(!selectedDate || !selectedTimeSlot || !firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim()) && !bookingLoading && (
                <p className="text-gray-500 text-xs mt-3 text-center">
                  {t('booking.fillFields')}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking

