# Quick Calendar Permission Fix

## Your Service Account Email
```
ragecage-calendar@handy-honor-479323-v9.iam.gserviceaccount.com
```

## Steps to Fix the Permission Error

1. **Open Google Calendar**
   - Go to [calendar.google.com](https://calendar.google.com)

2. **Find Your Calendar**
   - Look for the calendar you're using for bookings
   - If you don't have one, create a new calendar

3. **Open Calendar Settings**
   - Click the three dots (⋮) next to your calendar name
   - Select **"Settings and sharing"**

4. **Share with Service Account**
   - Scroll down to **"Share with specific people"**
   - Click **"Add people"**
   - Enter this email: `ragecage-calendar@handy-honor-479323-v9.iam.gserviceaccount.com`
   - **IMPORTANT:** Select **"Make changes to events"** permission (NOT "See all event details")
   - Click **"Send"**

5. **Get Your Calendar ID**
   - Still in "Settings and sharing"
   - Scroll to **"Integrate calendar"** section
   - Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com` or just `primary`)

6. **Update Backend Configuration**
   - Open `backend/.env` file
   - Set `GOOGLE_CALENDAR_ID=your-calendar-id-here`
   - Save the file
   - Restart the backend server

7. **Test Again**
   - Go back to your booking page
   - Try creating a booking
   - It should work now!

## Troubleshooting

- **Still getting permission error?**
  - Make sure you selected "Make changes to events" (not just "See all event details")
  - Wait a few seconds after sharing - Google Calendar needs a moment to update permissions
  - Restart your backend server after updating `.env`

- **Can't find the calendar?**
  - Make sure you're looking at the correct Google account
  - Check if the calendar is hidden or in a different view

- **Need to create a new calendar?**
  - Click the "+" next to "Other calendars" in the left sidebar
  - Select "Create new calendar"
  - Give it a name like "RageCage Bookings"
  - Follow steps 3-7 above





