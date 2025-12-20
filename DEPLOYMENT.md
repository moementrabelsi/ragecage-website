# Free Hosting Guide for RageCage Website

This guide will help you deploy your website for free so friends can test it.

## Recommended Setup

- **Frontend**: Vercel (free, easy, perfect for React/Vite)
- **Backend**: Render (free tier available)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend

1. Make sure your backend code is pushed to GitHub
2. Create a `.gitignore` in the `backend/` folder if you don't have one:
   ```gitignore
   node_modules/
   .env
   config/service-account-key.json
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)
3. Click "New +" → "Web Service"

### Step 3: Connect Your Repository

1. Connect your GitHub account
2. Select your `ragecage-website` repository
3. Choose the repository

### Step 4: Configure Backend Service

**Settings:**
- **Name**: `ragecage-backend` (or any name)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: **Free** (spins down after 15 min inactivity, but free!)

### Step 5: Add Environment Variables

Click "Environment" and add these variables:

```
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
GOOGLE_CALENDAR_ID=your-calendar-id
TIMEZONE=America/New_York
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
BOOKING_FROM_EMAIL=your-email@gmail.com
LOGO_URL=https://drive.google.com/uc?export=view&id=1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2
```

**Important**: 
- Replace `your-frontend-url.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)
- You can update `FRONTEND_URL` later if needed

### Step 6: Add Service Account Key

Since `service-account-key.json` shouldn't be in git, you have two options:

**Option A: Use Environment Variable (Recommended)**
1. Open your `service-account-key.json` file
2. Copy the entire JSON content
3. In Render, add a new environment variable:
   - **Key**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON (as one line, or use Render's multi-line support)

4. Update `backend/config/calendarService.js` to read from env var:
   ```javascript
   // At the top of calendarService.js
   const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY 
     ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
     : JSON.parse(fs.readFileSync(path.join(__dirname, '../config/service-account-key.json')))
   ```

**Option B: Upload via Render Shell**
1. In Render dashboard, click on your service
2. Go to "Shell" tab
3. Create the directory: `mkdir -p config`
4. Upload your file (you'll need to use `cat > config/service-account-key.json` and paste content)

### Step 7: Deploy

1. Click "Create Web Service"
2. Wait for deployment (first time takes ~5 minutes)
3. Copy your backend URL (looks like: `https://ragecage-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Click "Add New..." → "Project"

### Step 2: Import Your Repository

1. Select your `ragecage-website` repository
2. Click "Import"

### Step 3: Configure Frontend

**Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL from Part 1.

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build (~2-3 minutes)
3. You'll get a URL like: `https://ragecage-website.vercel.app`

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `FRONTEND_URL` environment variable to your Vercel URL
4. Redeploy (Render will auto-redeploy when env vars change)

---

## Part 3: Update Google Drive Logo Link

If you're using a Google Drive link, convert it to a direct image link:

1. Your current link: `https://drive.google.com/file/d/1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2/view?usp=sharing`
2. Extract the file ID: `1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2`
3. Use this format: `https://drive.google.com/uc?export=view&id=1tZIiMLuEqetBmSsUjvaQcnIiPHRZEJm2`
4. Update `LOGO_URL` in Render environment variables

---

## Testing Your Deployment

1. Visit your Vercel URL
2. Test the contact form
3. Test the booking system
4. Check browser console for any errors

---

## Troubleshooting

### Backend not responding
- Check Render logs: Go to your service → "Logs" tab
- Verify environment variables are set correctly
- Make sure the service isn't sleeping (free tier spins down after 15 min)

### CORS errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that backend is running (first request after sleep takes ~30 seconds)

### Environment variables not working
- In Vercel, make sure variables start with `VITE_` for frontend
- Redeploy after changing environment variables

### Service Account Key issues
- Make sure the JSON is valid
- Check that the service account email has access to your Google Calendar

---

## Free Tier Limitations

### Render (Backend)
- ✅ Free forever
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds to wake up
- ✅ 750 hours/month free (enough for testing)

### Vercel (Frontend)
- ✅ Free forever
- ✅ No sleep/spin-down
- ✅ Fast CDN worldwide
- ✅ Automatic HTTPS

---

## Alternative: Netlify (Frontend)

If you prefer Netlify over Vercel:

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
7. Deploy!

---

## Quick Links

- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Your Backend URL](https://dashboard.render.com) (after deployment)
- [Your Frontend URL](https://vercel.com/dashboard) (after deployment)

---

## Next Steps

1. Share your Vercel URL with friends
2. Monitor Render logs if issues occur
3. Consider upgrading to paid tier if you need:
   - No sleep/spin-down (Render)
   - Custom domain
   - More resources

Good luck! 🚀


