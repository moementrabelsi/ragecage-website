import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import availabilityRoutes from './routes/availability.js'
import bookingRoutes from './routes/booking.js'
import contactRoutes from './routes/contact.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://smash-room.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      console.warn('Blocked by CORS:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

