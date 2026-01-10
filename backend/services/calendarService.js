import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Generate time slots for a given day of the week
 * Tuesday-Friday: 11:00 to 22:00 (11h to 22h)
 * Saturday-Sunday: 10:00 to 22:00 (10h to 22h)
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns {string[]} - Array of time slots in HH:MM format
 */
function getTimeSlotsForDay(dayOfWeek) {
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

/**
 * Define all possible time slots (legacy - kept for backward compatibility)
 * This is now replaced by getTimeSlotsForDay()
 */
const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
]

/**
 * Initialize Google Calendar API client using Service Account
 */
function getCalendarClient() {
  try {
    let key
    
    // Try to read from environment variable first (for cloud deployment)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
        console.log('Using service account key from environment variable')
      } catch (parseError) {
        console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY from environment:', parseError)
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format in environment variable')
      }
    } else {
      // Fall back to file (for local development)
      const keyPath = path.join(__dirname, '../config/service-account-key.json')
      
      if (!fs.existsSync(keyPath)) {
        throw new Error(
          'Service account key not found. Please either:\n' +
          '1. Set GOOGLE_SERVICE_ACCOUNT_KEY environment variable, or\n' +
          '2. Place your Google Service Account JSON key at: ' + keyPath
        )
      }

      key = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
      console.log('Using service account key from file')
    }
    
    // Authenticate using service account (read and write permissions)
    const auth = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/calendar']
    )

    return google.calendar({ version: 'v3', auth })
  } catch (error) {
    console.error('Error initializing Google Calendar client:', error)
    throw error
  }
}

/**
 * Get calendar ID from environment or use default
 */
function getCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID || 'primary'
}

/**
 * Get timezone offset in hours for a given timezone (simplified, doesn't account for DST)
 * This is a workaround since we don't have a timezone library
 */
function getTimezoneOffsetHours(timezone) {
  // Common timezone offsets (simplified, doesn't handle DST)
  const offsets = {
    'Europe/Paris': 1,  // CET (UTC+1), CEST (UTC+2) in summer
    'Africa/Tunis': 1,  // CET (UTC+1) year-round, no DST
    'Africa/Cairo': 2,  // EET (UTC+2), EEST (UTC+3) in summer
    'UTC': 0,
    'America/New_York': -5,  // EST (UTC-5), EDT (UTC-4) in summer
    'America/Los_Angeles': -8,  // PST (UTC-8), PDT (UTC-7) in summer
    'Asia/Dubai': 4,  // GST (UTC+4) year-round
    'Asia/Tokyo': 9,  // JST (UTC+9) year-round
  }
  return offsets[timezone] || 0
}

/**
 * Check if a time slot conflicts with any calendar events
 * Uses timezone-aware comparison to avoid timezone mismatches
 */
function isSlotBooked(timeSlot, events, dateString) {
  const timezone = process.env.TIMEZONE || 'Europe/Paris'
  
  if (!events || events.length === 0) {
    return false
  }
  
  // Parse date and time components
  const [year, month, day] = dateString.split('-').map(Number)
  const [hours, minutes] = timeSlot.split(':').map(Number)
  
  // Calculate end time (30 minutes after start)
  let endHours = hours
  let endMinutes = minutes + 30
  if (endMinutes >= 60) {
    endHours += 1
    endMinutes = 0
  }
  
  // Get timezone offset (in hours from UTC)
  // Note: This is a simplified approach that doesn't account for DST
  // For production, consider using a library like date-fns-tz or moment-timezone
  const timezoneOffset = getTimezoneOffsetHours(timezone)
  
  // Create slot dates in UTC by subtracting the timezone offset
  // This ensures we're comparing in the same timezone context as calendar events
  const slotStartUTC = new Date(Date.UTC(year, month - 1, day, hours - timezoneOffset, minutes, 0))
  const slotEndUTC = new Date(Date.UTC(year, month - 1, day, endHours - timezoneOffset, endMinutes, 0))

  const isBooked = events.some(event => {
    if (!event.start.dateTime && !event.start.date) return false
    
    // Get event times - these are in ISO format with timezone info from Google Calendar
    const eventStart = new Date(event.start.dateTime || event.start.date)
    const eventEnd = new Date(event.end.dateTime || event.end.date)

    // Check for overlap (comparing UTC timestamps)
    const hasOverlap = (slotStartUTC < eventEnd && slotEndUTC > eventStart)
    
    if (hasOverlap) {
      console.log('Slot conflict detected:', {
        timeSlot,
        dateString,
        slotStartUTC: slotStartUTC.toISOString(),
        slotEndUTC: slotEndUTC.toISOString(),
        eventStart: eventStart.toISOString(),
        eventEnd: eventEnd.toISOString(),
        eventSummary: event.summary,
        timezone,
        timezoneOffset
      })
    }
    
    return hasOverlap
  })

  return isBooked
}

/**
 * Fetch all events for a given date from Google Calendar
 */
async function fetchEventsForDate(dateString, calendarClient) {
  try {
    const calendarId = getCalendarId()
    const timezone = process.env.TIMEZONE || 'Europe/Paris'
    
    // Parse date components to avoid timezone shifts
    const [year, month, day] = dateString.split('-').map(Number)
    
    // Create date range for the entire day (start of day to end of day) in local timezone
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0)
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59)

    console.log('=== FETCH EVENTS DEBUG ===')
    console.log('Date String:', dateString)
    console.log('Start of Day:', startOfDay.toISOString())
    console.log('End of Day:', endOfDay.toISOString())

    const response = await calendarClient.events.list({
      calendarId: calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []
    console.log('Found events:', events.length)
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        summary: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date
      })
    })
    console.log('========================')

    return events
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error)
    throw error
  }
}

/**
 * Get available time slots for a given date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<string[]>} - Array of available time slots in HH:MM format
 */
export async function getAvailableTimeSlots(dateString) {
  try {
    const calendarClient = getCalendarClient()
    const events = await fetchEventsForDate(dateString, calendarClient)

    // Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
    // Parse date parts to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    
    // Get time slots for this day of week
    const dayTimeSlots = getTimeSlotsForDay(dayOfWeek)

    // Check if the date is today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDateOnly = new Date(year, month - 1, day)
    selectedDateOnly.setHours(0, 0, 0, 0)
    const isToday = selectedDateOnly.getTime() === today.getTime()

    // Filter out booked slots and past time slots (if today)
    const availableSlots = dayTimeSlots.filter(slot => {
      // First check if slot is booked
      if (isSlotBooked(slot, events, dateString)) {
        return false
      }

      // If it's today, filter out past time slots
      if (isToday) {
        const [hours, minutes] = slot.split(':').map(Number)
        const now = new Date()
        const currentHours = now.getHours()
        const currentMinutes = now.getMinutes()

        // Check if the slot time has passed
        if (hours < currentHours) {
          return false
        }
        if (hours === currentHours && minutes <= currentMinutes) {
          return false
        }
      }

      return true
    })

    return availableSlots
  } catch (error) {
    console.error('Error getting available time slots:', error)
    // Return time slots for the day if there's an error (fail open)
    // In production, you might want to fail closed instead
    try {
      const date = new Date(dateString + 'T00:00:00')
      const dayOfWeek = date.getDay()
      const dayTimeSlots = getTimeSlotsForDay(dayOfWeek)
      console.warn('Returning day slots due to error')
      return dayTimeSlots
    } catch (e) {
      console.warn('Returning empty slots due to error')
      return []
    }
  }
}

/**
 * Get all time slots for a given day (for reference)
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns {string[]} - Array of time slots in HH:MM format
 */
export function getAllTimeSlots(dayOfWeek = null) {
  if (dayOfWeek !== null) {
    return getTimeSlotsForDay(dayOfWeek)
  }
  // Legacy: return all slots if no day specified
  return ALL_TIME_SLOTS
}

/**
 * Format time slot for display (helper function)
 */
function formatTimeSlot(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Create a booking event in Google Calendar
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeSlot - Time slot in HH:MM format
 * @param {number} groupSize - Number of people in the group
 * @param {string} customerName - Full name of the customer
 * @param {string} phoneNumber - Phone number of the customer
 * @param {string} customerEmail - Email of the customer (optional)
 * @param {string} specialRequests - Special requests from the customer (optional)
 * @returns {Promise<Object>} - Created event object
 */
export async function createBooking(dateString, timeSlot, groupSize, customerName = 'Guest', phoneNumber = '', customerEmail = '', specialRequests = '') {
  try {
    const calendarClient = getCalendarClient()
    const calendarId = getCalendarId()
    const timezone = process.env.TIMEZONE || 'Europe/Paris'

    // Parse the date and time components
    const [hours, minutes] = timeSlot.split(':').map(Number)
    
    // Calculate end time (30 minutes after start)
    let endHours = hours
    let endMinutes = minutes + 30
    if (endMinutes >= 60) {
      endHours += 1
      endMinutes = 0
    }
    
    // Get timezone offset for explicit RFC3339 format
    // This ensures Google Calendar interprets the time correctly
    const timezoneOffset = getTimezoneOffsetHours(timezone)
    const offsetSign = timezoneOffset >= 0 ? '+' : '-'
    const offsetHours = Math.abs(timezoneOffset).toString().padStart(2, '0')
    const offsetString = `${offsetSign}${offsetHours}:00`
    
    // Create proper datetime strings in RFC3339 format with explicit timezone offset
    // Format: YYYY-MM-DDTHH:MM:SS+HH:MM (e.g., 2026-01-07T12:30:00+01:00)
    const startDateTimeString = `${dateString}T${timeSlot}:00${offsetString}`
    const endHoursFormatted = endHours.toString().padStart(2, '0')
    const endMinutesFormatted = endMinutes.toString().padStart(2, '0')
    const endDateTimeString = `${dateString}T${endHoursFormatted}:${endMinutesFormatted}:00${offsetString}`

    // Format time for display
    const displayTime = formatTimeSlot(timeSlot)

    // Debug logging
    console.log('=== CREATE BOOKING DEBUG ===')
    console.log('Timezone:', timezone)
    console.log('Timezone Offset:', offsetString)
    console.log('Input Date String:', dateString)
    console.log('Input Time Slot:', timeSlot)
    console.log('Start DateTime String (RFC3339):', startDateTimeString)
    console.log('End DateTime String (RFC3339):', endDateTimeString)
    console.log('Display Time:', displayTime)
    console.log('Customer Email:', customerEmail)
    console.log('==========================')

    // --- LAST-SECOND DOUBLE-BOOKING GUARD ----------------------------
    // Re-fetch events for the selected date to ensure the slot is still free
    const eventsForDate = await fetchEventsForDate(dateString, calendarClient)

    // Use existing isSlotBooked() logic to detect overlap
    const slotAlreadyBooked = isSlotBooked(timeSlot, eventsForDate, dateString)

    if (slotAlreadyBooked) {
      console.warn('createBooking aborted: slot already taken', {
        dateString,
        timeSlot,
      })

      // Custom error that the API / frontend can detect
      const error = new Error('Selected time slot is already booked')
      error.code = 'SLOT_TAKEN'
      error.type = 'SLOT_TAKEN'
      error.statusCode = 409
      throw error
    }
    // -----------------------------------------------------------------

    // Create event object
    let description = `Rage Room Booking

Customer Information:
Name: ${customerName || 'Guest'}
Phone: ${phoneNumber || 'Not provided'}`
    
    // Add email if provided (check for non-empty string)
    const trimmedEmail = customerEmail ? customerEmail.trim() : ''
    if (trimmedEmail !== '') {
      description += `\nEmail: ${trimmedEmail}`
      console.log('Adding email to description:', trimmedEmail)
    } else {
      console.log('Email not provided or empty')
    }
    
    description += `\n\nGroup Size: ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`

    // Add special requests if provided (check for non-empty string)
    const trimmedRequests = specialRequests ? specialRequests.trim() : ''
    if (trimmedRequests !== '') {
      description += `\n\nSpecial Requests:\n${trimmedRequests}`
      console.log('Adding special requests to description:', trimmedRequests)
    } else {
      console.log('Special requests not provided or empty')
    }

    description += `\n\nBooked through Smash Room website.`
    
    console.log('Final event description:', description)
    
    const event = {
      summary: `Smash Room Session - ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`,
      description: description,
      start: {
        dateTime: startDateTimeString,
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTimeString,
        timeZone: timezone,
      },
      colorId: '11', // Red color for rage room bookings
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Email reminder 24 hours before
          { method: 'popup', minutes: 60 }, // Popup reminder 1 hour before
        ],
      },
    }

    // Note: Service accounts cannot add attendees or send email updates
    // Email is included in the description instead
    // If you need to send email notifications, use OAuth2 with user consent instead of service account

    // Insert event into calendar
    const response = await calendarClient.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'none', // Service accounts cannot send email updates
    })

    return response.data
  } catch (error) {
    console.error('Error creating booking in Google Calendar:', error)
    throw error
  }
}

