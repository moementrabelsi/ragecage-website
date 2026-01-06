import express from 'express'
import { createBooking } from '../services/calendarService.js'
// import { sendBookingConfirmationEmail } from '../services/emailService.js' // Email functionality disabled

const router = express.Router()

/**
 * POST /api/book
 * Create a new booking in Google Calendar
 * 
 * Request body:
 * {
 *   "date": "YYYY-MM-DD",
 *   "timeSlot": "HH:MM",
 *   "groupSize": 1-5,
 *   "customerName": "John Doe" (optional),
 *   "customerEmail": "john@example.com" (optional)
 * }
 */
router.post('/book', async (req, res) => {
  try {
    const { date, timeSlot, groupSize, firstName, lastName, phoneNumber, email, specialRequests } = req.body

    // Validation
    if (!date || !timeSlot || !groupSize || !firstName || !lastName || !phoneNumber || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['date', 'timeSlot', 'groupSize', 'firstName', 'lastName', 'phoneNumber', 'email']
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = email.trim()
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        error: 'Invalid email format'
      })
    }

    // Validate phone number (exactly 8 digits)
    const phoneRegex = /^\d{8}$/
    const trimmedPhone = phoneNumber.trim().replace(/\s+/g, '') // Remove spaces
    if (!phoneRegex.test(trimmedPhone)) {
      return res.status(400).json({
        error: 'Phone number must be exactly 8 digits'
      })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    // Validate time slot format
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(timeSlot)) {
      return res.status(400).json({
        error: 'Invalid time slot format. Use HH:MM (24-hour format)'
      })
    }

    // Validate group size
    const groupSizeNum = parseInt(groupSize)
    if (isNaN(groupSizeNum) || groupSizeNum < 1 || groupSizeNum > 5) {
      return res.status(400).json({
        error: 'Group size must be between 1 and 5'
      })
    }

    // Create booking in Google Calendar
    const customerName = `${firstName.trim()} ${lastName.trim()}`
    const customerEmail = trimmedEmail
    const customerSpecialRequests = specialRequests ? specialRequests.trim() : ''
    
    console.log('Creating booking with:', { 
      customerName, 
      phoneNumber, 
      email: customerEmail, 
      specialRequests: customerSpecialRequests, 
      groupSize: groupSizeNum 
    })
    
    const event = await createBooking(
      date,
      timeSlot,
      groupSizeNum,
      customerName,
      trimmedPhone,
      customerEmail,
      customerSpecialRequests
    )

    // Send response immediately to avoid timeout
    res.json({
      success: true,
      message: 'Booking created successfully.',
      booking: {
        id: event.id,
        date,
        timeSlot,
        groupSize: groupSizeNum,
        eventLink: event.htmlLink,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
      }
    })

    // Email functionality disabled
    // Send confirmation email in the background (non-blocking)
    // This prevents slow email sending from timing out the request
    /*
    sendBookingConfirmationEmail({
      customerEmail,
      customerName,
      date,
      timeSlot,
      groupSize: groupSizeNum,
      phoneNumber: trimmedPhone,
      specialRequests: customerSpecialRequests,
      eventLink: event.htmlLink,
    })
      .then(() => {
        console.log('Booking confirmation email sent successfully to:', customerEmail)
      })
      .catch((emailError) => {
        // Log email error but don't fail the booking since it's already created
        console.error('Failed to send confirmation email:', emailError)
        console.error('Email details:', { customerEmail, customerName, date, timeSlot })
      })
    */
  } catch (error) {
    console.error('Error creating booking:', error)
    
    // Check for specific error types
    let errorMessage = error.message
    let statusCode = 500
    
    // Handle double booking error
    if (error.code === 'SLOT_TAKEN' || error.type === 'SLOT_TAKEN') {
      statusCode = 409
      errorMessage = 'Sorry, this time slot was just booked. Please choose another one.'
    } else if (error.message && error.message.includes('writer access')) {
      statusCode = 403
      errorMessage = 'Calendar permission error. The service account needs "Make changes to events" permission on your Google Calendar. Please check the setup instructions in backend/README.md'
    } else if (error.code === 403 || error.message?.includes('permission') || error.message?.includes('Forbidden')) {
      statusCode = 403
      errorMessage = 'Calendar permission denied. Please ensure the service account has "Make changes to events" permission on your Google Calendar.'
    }
    
    res.status(statusCode).json({
      error: 'Failed to create booking',
      message: errorMessage,
      details: statusCode === 403 ? 'To fix this: 1) Open Google Calendar, 2) Go to calendar settings, 3) Share with your service account email, 4) Give it "Make changes to events" permission' : undefined
    })
  }
})

export default router

