# EmailJS Setup Guide

This guide will help you set up EmailJS for the contact form.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier includes 200 emails/month)

## Step 2: Create an Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Note your Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:

**Subject:** `New Contact Form Message from {{from_name}}`

**Content:**
```
You have received a new message from your website contact form.

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Message:
{{message}}

---
This message was sent from the Smash Room website.
```

4. **Note your Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
   - Or directly visit: https://dashboard.emailjs.com/admin/account
2. Look for the **Public Key** section
3. The Public Key is a long string of characters (usually starts with letters/numbers, no spaces)
   - Example format: `AbCdEfGhIjKlMnOpQrStUvWxYz123456`
   - It's different from your Service ID and Template ID
4. **Important:** Make sure you're copying the **Public Key**, not the Private Key or any other value
5. Copy the entire Public Key (it should be one continuous string)

## Step 5: Configure Environment Variables

### For Local Development:

1. Create a `.env` file in the root directory of your project (same level as `package.json`)
2. Add the following:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Backend API URL (optional)
VITE_API_URL=http://localhost:3001
```

3. Replace the placeholder values with your actual EmailJS credentials
4. **Restart your development server** (stop and run `npm run dev` again)

### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these three variables:
   - `VITE_EMAILJS_SERVICE_ID` = your service ID
   - `VITE_EMAILJS_TEMPLATE_ID` = your template ID
   - `VITE_EMAILJS_PUBLIC_KEY` = your public key
4. **Redeploy** your application

## Step 6: Test the Contact Form

1. Fill out the contact form on your website
2. Submit the form
3. Check your email inbox for the message
4. If you see an error, verify:
   - All environment variables are set correctly
   - You've restarted the dev server (for local development)
   - The EmailJS service is active and connected

## Troubleshooting

**Error: "Email service not configured"**
- Make sure you've created a `.env` file with all three EmailJS variables
- Restart your development server after creating/updating `.env`
- Check that variable names start with `VITE_` (required for Vite)

**Error: "Failed to send email"**
- Verify your EmailJS service is connected and active
- Check that your template variables match: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{message}}`
- Ensure you haven't exceeded the free tier limit (200 emails/month)

**Not receiving emails:**
- Check your spam folder
- Verify the email service connection in EmailJS dashboard
- Make sure the "To Email" field in your template is set correctly

## Security Note

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- The Public Key is safe to expose in frontend code (it's designed for client-side use)
- Service ID and Template ID are also safe to expose (they're public identifiers)

