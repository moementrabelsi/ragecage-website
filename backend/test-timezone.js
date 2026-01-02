/**
 * Test script to verify timezone configuration
 * Run with: node test-timezone.js
 */

import dotenv from 'dotenv'
dotenv.config()

const timezone = process.env.TIMEZONE || 'Europe/Paris'

console.log('=== TIMEZONE CONFIGURATION TEST ===\n')
console.log('Configured Timezone:', timezone)
console.log('Server Local Time:', new Date().toString())
console.log('Server UTC Time:', new Date().toISOString())
console.log('\n=== TEST BOOKING SCENARIO ===')

// Test: booking for December 25, 2024 at 11:00 AM
const testDate = '2024-12-25'
const testTime = '11:00'

console.log(`\nTest: Booking for ${testDate} at ${testTime}`)

// How it's created in the backend
const dateTimeString = `${testDate}T${testTime}:00`
console.log('DateTime String:', dateTimeString)

// How it appears in Google Calendar (with timezone)
console.log(`Will appear in Google Calendar as: ${dateTimeString} (${timezone})`)

// What time this is in UTC
const [year, month, day] = testDate.split('-').map(Number)
const [hours, minutes] = testTime.split(':').map(Number)
const localDate = new Date(year, month - 1, day, hours, minutes, 0)
console.log('As UTC:', localDate.toISOString())

console.log('\n=== RECOMMENDATIONS ===')
console.log('1. Ensure TIMEZONE in .env matches your business location')
console.log('2. After changing TIMEZONE, restart the backend server')
console.log('3. Common timezones:')
console.log('   - Tunisia: Africa/Tunis')
console.log('   - France: Europe/Paris')
console.log('   - UK: Europe/London')
console.log('   - USA East: America/New_York')
console.log('\n=================================\n')


