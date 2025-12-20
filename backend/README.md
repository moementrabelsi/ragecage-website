# RageCage Backend API

Backend server for RageCage booking system with Google Calendar integration.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "ragecage-calendar")
   - Grant it "Editor" role
5. Create a key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the JSON file
6. Place the JSON file at: `backend/config/service-account-key.json`

### 3. Share Calendar with Service Account

1. Open Google Calendar
2. Find the calendar you want to use (or create a new one)
3. Click the three dots next to the calendar name
4. Select "Settings and sharing"
5. Under "Share with specific people", add the service account email (from the JSON file, `client_email` field)
6. Give it **"Make changes to events"** permission (required for creating bookings)
7. Copy the Calendar ID (found in "Integrate calendar" section)

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Google Calendar Configuration
   GOOGLE_CALENDAR_ID=your-calendar-id-here
TIMEZONE=America/New_York

# Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
# Note: The "from" email must use the same domain as SMTP_USER (verified domain)
# For contact form and booking emails, SMTP_USER will be used as the sender
BOOKING_FROM_EMAIL=your-email@gmail.com  # Should match SMTP_USER domain

# Contact Form Settings (optional)
# CONTACT_TO=contact@yourdomain.com  # Where to send contact form submissions
# CONTACT_FROM will use SMTP_USER automatically (must be verified domain)

# Logo URL (optional - if not set, uses Google Drive logo)
# LOGO_URL=https://drive.google.com/uc?export=view&id=1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2
```

**Email Setup:**
- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- For other providers: Check their SMTP settings (host, port, security)
- `BOOKING_FROM_EMAIL`: The email address that will appear as the sender (can be same as SMTP_USER)

### 5. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/availability?date=YYYY-MM-DD

Returns available time slots for a given date.

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format

**Response:**
```json
{
  "date": "2024-12-15",
  "available": ["09:00", "10:00", "12:00", "15:00", "18:00"],
  "totalSlots": 5
}
```

**Error Response:**
```json
{
  "error": "Date parameter is required. Format: YYYY-MM-DD"
}
```

### POST /api/book

Creates a new booking in Google Calendar.

**Request Body:**
```json
{
  "date": "2024-12-15",
  "timeSlot": "14:00",
  "groupSize": 3,
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

**Required Fields:**
- `date`: Date in YYYY-MM-DD format
- `timeSlot`: Time in HH:MM format (24-hour)
- `groupSize`: Number between 1 and 5
- `firstName`: Customer first name
- `lastName`: Customer last name
- `phoneNumber`: Customer phone number
- `email`: Customer email address (required for confirmation email)

**Optional Fields:**
- `specialRequests`: Any special requests or notes

**Success Response:**
```json
{
  "success": true,
  "message": "Booking created successfully. Confirmation email sent.",
  "booking": {
    "id": "event-id-123",
    "date": "2024-12-15",
    "timeSlot": "14:00",
    "groupSize": 3,
    "eventLink": "https://calendar.google.com/calendar/event?eid=...",
    "startTime": "2024-12-15T14:00:00Z",
    "endTime": "2024-12-15T15:00:00Z"
  }
}
```

**Note:** A confirmation email with booking details and a satisfaction form link will be automatically sent to the customer's email address.

**Error Response:**
```json
{
  "error": "Failed to create booking",
  "message": "Error details here"
}
```

## Time Slots

Default time slots are hourly from 9:00 AM to 8:00 PM:
- 09:00, 10:00, 11:00, 12:00
- 13:00, 14:00, 15:00, 16:00
- 17:00, 18:00, 19:00, 20:00

## Architecture

- `server.js` - Main Express server
- `routes/availability.js` - Availability API routes
- `services/calendarService.js` - Google Calendar integration
- `config/` - Configuration files (service account key)

## Architecture

- `server.js` - Main Express server
- `routes/availability.js` - Availability API routes
- `routes/booking.js` - Booking creation API routes
- `services/calendarService.js` - Google Calendar integration (read & write)
- `services/emailService.js` - Email sending service for booking confirmations
- `config/` - Configuration files (service account key)

## Features

- ✅ Google Calendar integration
- ✅ Double-booking prevention
- ✅ Email confirmation with booking details
- ✅ Satisfaction form link in confirmation email
- ✅ Real-time availability checking

## Future Enhancements

- Multiple calendar support (different rooms)
- Booking cancellation endpoint
- Email reminders before booking

