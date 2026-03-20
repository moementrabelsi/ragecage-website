import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import TopBanner from './components/TopBanner'
import DeferredSection from './components/DeferredSection'

const WhoWeAre = lazy(() => import('./components/WhoWeAre'))
const ServicesRooms = lazy(() => import('./components/ServicesRooms'))
const Gallery = lazy(() => import('./components/Gallery'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
const Booking = lazy(() => import('./pages/Booking'))
const NotFound = lazy(() => import('./pages/NotFound'))

const sectionFallback = <div className="min-h-[280px]" />

function Home() {
  return (
    <div className="min-h-screen bg-rage-black text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar />
      <TopBanner />
      <section id="home">
        <HeroCarousel />
      </section>
      <DeferredSection id="about" className="min-h-[500px]">
        <Suspense fallback={sectionFallback}>
          <WhoWeAre />
        </Suspense>
      </DeferredSection>
      <DeferredSection id="services" className="min-h-[500px]">
        <Suspense fallback={sectionFallback}>
          <ServicesRooms />
        </Suspense>
      </DeferredSection>
      <DeferredSection id="gallery" className="min-h-[500px]">
        <Suspense fallback={sectionFallback}>
          <Gallery />
        </Suspense>
      </DeferredSection>
      <DeferredSection id="contact" className="min-h-[450px]">
        <Suspense fallback={sectionFallback}>
          <Contact />
        </Suspense>
      </DeferredSection>
      <DeferredSection id="footer">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </DeferredSection>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      <BackToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/booking"
          element={
            <Suspense fallback={<div className="min-h-screen bg-rage-black" />}>
              <Booking />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-rage-black" />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </LanguageProvider>
  )
}

export default App


