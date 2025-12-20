import { Routes, Route } from 'react-router-dom'
import { Element } from 'react-scroll'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import WhoWeAre from './components/WhoWeAre'
import ServicesRooms from './components/ServicesRooms'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Booking from './pages/Booking'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollProgress from './components/ScrollProgress'

function Home() {
  return (
    <div className="min-h-screen bg-rage-black text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar />
      <Element name="home">
        <HeroCarousel />
      </Element>
      <Element name="about">
        <WhoWeAre />
      </Element>
      <Element name="services">
        <ServicesRooms />
      </Element>
      <Element name="gallery">
        <Gallery />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
    </LanguageProvider>
  )
}

export default App


