import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import availabilityRoutes from './routes/availability.js'
import bookingRoutes from './routes/booking.js'
import contactRoutes from './routes/contact.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api', availabilityRoutes)
app.use('/api', bookingRoutes)
app.use('/api', contactRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RageCage API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RageCage API server running on port ${PORT}`)
})

