# RageCage Website

A modern, single-page website for RageCage built with React, Vite, TailwindCSS, and Framer Motion, with Google Calendar integration for booking management.

## Features

- 🎨 Bold yellow, black, and red theme
- 🎠 Full-width auto-playing image carousel with Swiper.js
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 🧭 Smooth scroll navigation
- 🎯 Multiple sections: Hero, About, Services, Gallery, Contact
- 📧 Functional contact form
- 🗺️ Embedded Google Maps
- 🔗 Social media integration

## Tech Stack

- **React.js** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Swiper.js** - Touch slider/carousel
- **React Scroll** - Smooth scrolling
- **React Icons** - Icon library
- **EmailJS** - Client-side email service for contact form

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud account with Calendar API enabled
- Google Service Account with Calendar access

### Installation

#### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Create .env file in the root directory
# Add the following variables:
```

Create a `.env` file in the root directory with:
```env
# Backend API URL (optional, defaults to http://localhost:3001)
VITE_API_URL=http://localhost:3001

# EmailJS Configuration (required for contact form)
# Get these from https://www.emailjs.com/
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Calendar API:
   - Follow instructions in `backend/README.md`
   - Place your service account JSON key at `backend/config/service-account-key.json`
   - Configure `.env` file with your calendar ID

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
ragecage-website/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with smooth scroll
│   │   ├── HeroCarousel.jsx    # Hero section with carousel
│   │   ├── WhoWeAre.jsx        # About section
│   │   ├── ServicesRooms.jsx   # Services and rooms cards
│   │   ├── Gallery.jsx         # Image gallery with hover effects
│   │   └── Contact.jsx         # Contact form and map
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Customization

### Colors

Edit `tailwind.config.js` to change the theme colors:
- `rage-yellow`: #FFD700
- `rage-black`: #000000
- `rage-red`: #DC143C

### Images

Replace the placeholder Unsplash images in the components with your own images.

### Contact Form

The contact form uses EmailJS to send emails directly from the browser. To set it up:

1. **Create an EmailJS account** at [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Create an Email Service** (Gmail, Outlook, etc.) and note the Service ID
3. **Create an Email Template** with the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Sender's phone (optional)
   - `{{message}}` - Message content
   - `{{to_name}}` - Your business name
4. **Get your Public Key** from EmailJS dashboard
5. **Add the credentials** to your `.env` file:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

The contact form will automatically use these credentials to send emails.

### Google Maps

Update the iframe `src` in `Contact.jsx` with your actual location coordinates.

## License

MIT


