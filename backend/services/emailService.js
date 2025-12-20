import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Create email transporter from environment variables
 */
function createTransport() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in your .env file.')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Use TLS for 465
    auth: { user, pass },
  })
}

/**
 * Format time slot for display (HH:MM -> 9:00 AM)
 */
function formatTimeSlot(timeSlot) {
  const [hours, minutes] = timeSlot.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Format date for display (YYYY-MM-DD -> Monday, January 15, 2024)
 */
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Send booking confirmation email to customer
 * @param {Object} bookingData - Booking information
 * @param {string} bookingData.customerEmail - Customer email address
 * @param {string} bookingData.customerName - Customer full name
 * @param {string} bookingData.date - Booking date (YYYY-MM-DD)
 * @param {string} bookingData.timeSlot - Booking time slot (HH:MM)
 * @param {number} bookingData.groupSize - Number of people
 * @param {string} bookingData.phoneNumber - Customer phone number
 * @param {string} bookingData.specialRequests - Special requests (optional)
 * @param {string} bookingData.eventLink - Google Calendar event link (optional)
 * @returns {Promise<Object>} - Email send result
 */
export async function sendBookingConfirmationEmail(bookingData) {
  const {
    customerEmail,
    customerName,
    date,
    timeSlot,
    groupSize,
    phoneNumber,
    specialRequests = '',
    eventLink = ''
  } = bookingData

  if (!customerEmail) {
    throw new Error('Customer email is required to send confirmation email')
  }

  const transporter = createTransport()
  // Use SMTP_USER as the from address (must be verified domain)
  // BOOKING_FROM_EMAIL should match SMTP_USER domain if set
  const fromEmail = process.env.BOOKING_FROM_EMAIL || process.env.SMTP_USER
  // Use the Google Forms satisfaction form link
  const satisfactionFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf907fWmSgBRTpm9ruQgJSzDv_ePYaj9TGVI9jr6N69LLyqBA/viewform'
  
  // Get logo - try to use hosted URL first, then try Google Drive, then local file
  let logoUrl = process.env.LOGO_URL
  if (!logoUrl) {
    // Use Google Drive direct image link as default
    // Converted from: https://drive.google.com/file/d/1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2/view?usp=sharing
    logoUrl = 'https://drive.google.com/uc?export=view&id=1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2'
    
    // Fallback: Try to load logo from public folder and convert to base64
    try {
      const logoPath = path.join(__dirname, '../../public/logo/rage.png')
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        const logoBase64 = logoBuffer.toString('base64')
        // Use base64 as fallback if Google Drive doesn't work
        const fallbackLogoUrl = `data:image/png;base64,${logoBase64}`
        // Keep Google Drive as primary, but have base64 as backup
        // For now, we'll use Google Drive URL
      }
    } catch (error) {
      console.warn('Could not load logo file, using Google Drive URL:', error.message)
    }
  }

  const formattedDate = formatDate(date)
  const formattedTime = formatTimeSlot(timeSlot)

  // HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Smash Room</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 2px solid #feae11; border-radius: 10px; padding: 30px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Smash Room Logo" style="max-width: 200px; height: auto; margin-bottom: 15px;" />
            <div style="width: 100px; height: 3px; background-color: #feae11; margin: 15px auto;"></div>
          </div>

          <!-- Confirmation Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0;">
              ✓ Booking Confirmed!
            </h2>
            <p style="color: #cccccc; font-size: 16px; margin: 0;">
              Your rage session has been successfully booked
            </p>
          </div>

          <!-- Booking Details -->
          <div style="background-color: #0a0a0a; border: 1px solid #333333; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #feae11; font-size: 20px; margin: 0 0 20px 0; text-transform: uppercase;">
              Booking Details
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px; width: 40%;">Customer Name:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px;">Phone Number:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px;">Date:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px;">Time:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px;">Group Size:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${groupSize} ${groupSize === 1 ? 'person' : 'people'}</td>
              </tr>
              ${specialRequests ? `
              <tr>
                <td style="padding: 10px 0; color: #cccccc; font-size: 14px; vertical-align: top;">Special Requests:</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px;">${specialRequests}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Important Information -->
          <div style="background-color: #1a1a1a; border-left: 4px solid #feae11; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #feae11; font-size: 18px; margin: 0 0 15px 0;">
              ⚠️ Important Information
            </h3>
            <ul style="color: #cccccc; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Wear comfortable clothes you don't mind getting dirty</li>
              <li>Closed-toe shoes are required</li>
              <li>All protective gear will be provided</li>
              <li>Valid ID required for participants 18+</li>
            </ul>
          </div>

          ${eventLink ? `
          <!-- Calendar Link -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${eventLink}" style="display: inline-block; background-color: #feae11; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">
              Add to Google Calendar
            </a>
          </div>
          ` : ''}

          <!-- Satisfaction Form -->
          <div style="background-color: #0a0a0a; border: 1px solid #333333; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #feae11; font-size: 18px; margin: 0 0 15px 0;">
              Share Your Experience
            </h3>
            <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
              After your session, we'd love to hear about your experience! 
              Click the button below to fill out our satisfaction form.
            </p>
            <a href="${satisfactionFormUrl}" style="display: inline-block; background-color: #feae11; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">
              Complete Satisfaction Form
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
            <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
              Thank you for choosing Smash Room!
            </p>
            <p style="color: #666666; font-size: 12px; margin: 0;">
              If you have any questions, please contact us at moemengamingg@gmail.com
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  // Plain text version
  const textContent = `
SMASH ROOM - BOOKING CONFIRMATION

✓ Your booking has been confirmed!

BOOKING DETAILS:
----------------
Customer Name: ${customerName}
Phone Number: ${phoneNumber}
Date: ${formattedDate}
Time: ${formattedTime}
Group Size: ${groupSize} ${groupSize === 1 ? 'person' : 'people'}
${specialRequests ? `Special Requests: ${specialRequests}\n` : ''}

IMPORTANT INFORMATION:
----------------------
- Please arrive 10 minutes before your scheduled time
- Wear comfortable clothes you don't mind getting dirty
- Closed-toe shoes are required
- All protective gear will be provided
- Valid ID required for participants 18+

${eventLink ? `Add to Google Calendar: ${eventLink}\n` : ''}

SHARE YOUR EXPERIENCE:
----------------------
After your session, we'd love to hear about your experience!
Complete our satisfaction form here:
${satisfactionFormUrl}

Thank you for choosing Smash Room!
If you have any questions, please contact us at moemengamingg@gmail.com
  `

  try {
    // Verify email configuration before sending
    if (!fromEmail) {
      throw new Error('SMTP configuration error: from email address is not set')
    }

    // Validate recipient email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      throw new Error(`Invalid recipient email format: ${customerEmail}`)
    }

    console.log('Attempting to send booking confirmation email:', {
      from: fromEmail,
      to: customerEmail,
      subject: `Booking Confirmation - ${formattedDate} at ${formattedTime}`,
    })

    const result = await transporter.sendMail({
      from: `"Smash Room" <${fromEmail}>`,
      to: customerEmail,
      subject: `Booking Confirmation - ${formattedDate} at ${formattedTime}`,
      text: textContent,
      html: htmlContent,
    })

    console.log('Booking confirmation email sent successfully:', {
      to: customerEmail,
      messageId: result.messageId,
      response: result.response,
    })

    return result
  } catch (error) {
    console.error('Error sending booking confirmation email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      to: customerEmail,
      from: fromEmail,
    })
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Failed to send email'
    
    if (error.code === 'EAUTH' || error.message?.includes('authentication')) {
      errorMessage = 'SMTP authentication failed. Please check your SMTP credentials.'
    } else if (error.code === 'ECONNECTION' || error.message?.includes('connection')) {
      errorMessage = 'Could not connect to SMTP server. Please check your SMTP settings.'
    } else if (error.responseCode === 550 || error.message?.includes('550')) {
      errorMessage = 'Email address rejected by server. Please verify the email address is valid.'
    } else if (error.responseCode === 553 || error.message?.includes('553')) {
      errorMessage = 'Email address format invalid or domain rejected.'
    }
    
    throw new Error(errorMessage)
  }
}

