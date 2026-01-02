# Quick Fix Guide - Booking Issues

## What Was Fixed ✅

### 1. Wrong Time in Calendar (11 AM → 12 PM issue)
- **Fixed timezone handling** in backend
- Changed default timezone to `Europe/Paris` (you can adjust this)
- Added proper date parsing to avoid timezone shifts

### 2. Booked Slots Still Showing as Available
- **Added automatic refresh** after booking
- Availability updates immediately
- No need to refresh the page

---

## What You Need to Do NOW

### Step 1: Set Your Timezone

Open `backend/.env` and add/update this line:

```env
# Choose the timezone where your business is located:

# If you're in Tunisia:
TIMEZONE=Africa/Tunis

# If you're in France:
TIMEZONE=Europe/Paris

# If you're in UK:
TIMEZONE=Europe/London
```

**Find your timezone**: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Step 2: Restart Backend

```bash
cd backend
npm run dev
```

### Step 3: Test It

1. Open booking page
2. Book for 11:00 AM
3. Check Google Calendar - should show **11:00 AM** (not 12:00 PM!)
4. Try booking the same slot again - should be **unavailable**

---

## Optional: Test Your Timezone Config

```bash
cd backend
node test-timezone.js
```

This shows exactly how your bookings will appear in Google Calendar.

---

## Still Having Issues?

Check `BOOKING_FIXES.md` for detailed troubleshooting.

---

**That's it! Your booking system should now work correctly.** 🎉


