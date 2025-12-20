import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

// Build a mail transport from env vars
function createTransport() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Use TLS for 465
    auth: { user, pass },
  })
}

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {}

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'message'],
      })
    }

    const to = process.env.CONTACT_TO || process.env.SMTP_USER
    // Use SMTP_USER as the from address (must be verified domain)
    // Format: "Display Name <email@verified-domain.com>"
    const fromEmail = process.env.SMTP_USER
    const from = `"Smash Room Contact Form" <${fromEmail}>`
    
    const subject = `New website inquiry from ${name}`
    const text = [
      'New message received via website contact form:',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const transporter = createTransport()
    await transporter.sendMail({
      from, // Use verified SMTP_USER email
      to,
      replyTo: email, // Set reply-to to customer's email so you can reply directly
      subject,
      text,
    })

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error sending contact email:', error)
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message || 'Email service not configured',
    })
  }
})

export default router



