# RageCage Booking System - Setup Guide

Complete setup instructions for the RageCage website with Google Calendar integration.

## Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure Google Calendar (see below)
# Then start server
npm start
```

Backend runs on: `http://localhost:3001`

## Google Calendar API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name it (e.g., "ragecage-calendar")
4. Grant it "Editor" role (or create custom role with Calendar permissions)
5. Click "Done"

### Step 3: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose **JSON** format
5. Download the JSON file

### Step 4: Place Service Account Key

1. Copy the downloaded JSON file
2. Place it at: `backend/config/service-account-key.json`
3. **Important**: This file is in `.gitignore` - never commit it!

### Step 5: Share Calendar with Service Account

1. Open [Google Calendar](https://calendar.google.com/)
2. Find the calendar you want to use (or create a new one)
3. Click the three dots (⋮) next to the calendar name
4. Select "Settings and sharing"
5. Scroll to "Share with specific people"
6. Click "Add people"
7. Enter the service account email (found in the JSON file, `client_email` field)
8. Give it **"See all event details"** permission
9. Click "Send"

### Step 6: Get Calendar ID

1. Still in calendar settings
2. Scroll to "Integrate calendar"
3. Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com` or just `primary`)

### Step 7: Configure Backend

1. In `backend/` directory, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set:
   ```
   GOOGLE_CALENDAR_ID=your-calendar-id-here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

## Testing the Integration

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Test the API endpoint:
   ```bash
   curl http://localhost:3001/api/availability?date=2024-12-15
   ```

   You should get a response like:
   ```json
   {
     "date": "2024-12-15",
     "available": ["09:00", "10:00", "11:00", ...],
     "totalSlots": 8
   }
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

4. Navigate to the booking page and select a date
5. Available time slots should load from Google Calendar

## Troubleshooting

### Backend won't start
- Check that `service-account-key.json` exists in `backend/config/`
- Verify the JSON file is valid
- Check `.env` file exists and has correct values

### No available slots showing
- Verify the service account email has access to the calendar
- Check the calendar ID in `.env` is correct
- Check backend console for error messages
- Verify Google Calendar API is enabled

### CORS errors
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend CORS is configured correctly

### API returns all slots as available
- This might mean the calendar has no events (which is fine)
- Or there's an error - check backend console logs

## Project Structure

```
ragecage-website/
├── backend/
│   ├── config/
│   │   ├── service-account-key.json.example
│   │   └── service-account-key.json (your key - not in git)
│   ├── routes/
│   │   └── availability.js
│   ├── services/
│   │   └── calendarService.js
│   ├── .env (your config - not in git)
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
├── src/
│   ├── pages/
│   │   └── Booking.jsx
│   └── ...
└── ...
```

## Next Steps

- Add POST `/api/book` endpoint to create bookings
- Support multiple calendars (different rooms)
- Add email notifications
- Add booking confirmation page





