import express from 'express'
import { getAvailableTimeSlots } from '../services/calendarService.js'

const router = express.Router()

/**
 * GET /api/availability?date=YYYY-MM-DD
 * Returns available time slots for a given date
 */
router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ 
        error: 'Date parameter is required. Format: YYYY-MM-DD' 
      })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return res.status(400).json({ 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      })
    }

    // Get available time slots from Google Calendar
    const availableSlots = await getAvailableTimeSlots(date)

    res.json({ 
      date,
      available: availableSlots,
      totalSlots: availableSlots.length
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    res.status(500).json({ 
      error: 'Failed to fetch availability',
      message: error.message 
    })
  }
})

export default router





