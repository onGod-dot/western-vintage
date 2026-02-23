import { useEffect, useRef, useState } from 'react'
import './App.css'

// Typewriter effect component
function Typewriter({ text, speed = 100 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return <span>{displayText}<span className="cursor">|</span></span>
}

function App() {
  const videoRef = useRef(null)
  const galleryRef = useRef(null)
  const galleryContainerRef = useRef(null)
  const landingPageRef = useRef(null)
  const aboutSectionRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [landingOpacity, setLandingOpacity] = useState(1)
  const [galleryOpacity, setGalleryOpacity] = useState(0)
  const [aboutOpacity, setAboutOpacity] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(1)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  
  const videos = [
    { src: '/mov/landing.mov', type: 'video/quicktime', name: 'Landing' },
    { src: '/mov/WhatsApp Video 2025-11-21 at 07.30.40.mp4', type: 'video/mp4', name: 'Video 1' },
    { src: '/mov/WhatsApp Video 2025-11-21 at 07.30.43.mp4', type: 'video/mp4', name: 'Video 2' }
  ]

  // Handle video switching
  const switchVideo = (index) => {
    if (index === currentVideoIndex) return
    setCurrentVideoIndex(index)
    setIsLoading(true)
    setError(null)
  }

  // Load and play current video
  useEffect(() => {
    const video = videoRef.current
    
    if (video && videos[currentVideoIndex]) {
      const currentVideo = videos[currentVideoIndex]
      console.log('Loading video:', currentVideo.src)
      
      // Handle video loaded
      const handleLoadedData = () => {
        console.log('Video loaded successfully')
        setIsLoading(false)
        video.play().catch(err => {
          console.error('Play error:', err)
          setError('Video play failed: ' + err.message)
        })
      }

      // Handle video errors
      const handleError = (e) => {
        console.error('Video error event:', e)
        console.error('Video error code:', video.error?.code)
        console.error('Video error message:', video.error?.message)
        setIsLoading(false)
        const errorMsg = video.error 
          ? `Video error (code ${video.error.code}): ${video.error.message || 'Unknown error'}`
          : 'Video failed to load. Please try another video.'
        setError(errorMsg)
      }

      // Handle video can play
      const handleCanPlay = () => {
        console.log('Video can play')
        setIsLoading(false)
      }

      // Handle video load start
      const handleLoadStart = () => {
        console.log('Video load started')
        setIsLoading(true)
      }

      // Handle video ended - loop
      const handleEnded = () => {
        video.currentTime = 0
        video.play()
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadstart', handleLoadStart)
      video.addEventListener('ended', handleEnded)

      // Set video source
      video.src = currentVideo.src
      video.load()
      
      // Try to play
      video.play().catch(err => {
        console.log('Initial play prevented (this is normal):', err)
      })

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('ended', handleEnded)
      }
    } else {
      console.error('Video ref is null or no video available')
    }
  }, [currentVideoIndex])

  // Smooth easing function for professional transitions
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  // Section fade effects on scroll with smooth easing
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight

          // Landing page fade effect - quick fade out
          if (landingPageRef.current) {
            const landingHeight = windowHeight
            const fadeStart = landingHeight * 0.2
            const fadeEnd = landingHeight * 0.8
            const fadeRange = fadeEnd - fadeStart

            if (scrollY <= fadeStart) {
              setLandingOpacity(1)
              setHeaderOpacity(1)
            } else if (scrollY >= fadeEnd) {
              setLandingOpacity(0)
              setHeaderOpacity(0)
            } else {
              const progress = (scrollY - fadeStart) / fadeRange
              const easedProgress = easeInOutQuad(progress)
              setLandingOpacity(Math.max(0, 1 - easedProgress))
              setHeaderOpacity(Math.max(0, 1 - easedProgress))
            }
          }

          // Gallery section fade effect
          if (galleryContainerRef.current) {
            const galleryTop = galleryContainerRef.current.offsetTop
            const fadeInStart = galleryTop - windowHeight * 0.8
            const fadeInEnd = galleryTop - windowHeight * 0.2
            const fadeInRange = fadeInEnd - fadeInStart

            if (scrollY <= fadeInStart) {
              setGalleryOpacity(0)
            } else if (scrollY >= fadeInEnd) {
              setGalleryOpacity(1)
            } else {
              const progress = (scrollY - fadeInStart) / fadeInRange
              const easedProgress = easeInOutQuad(progress)
              setGalleryOpacity(easedProgress)
            }
          }

          // Horizontal scroll effect for gallery
          if (galleryContainerRef.current && galleryRef.current) {
            const galleryTop = galleryContainerRef.current.offsetTop
            const galleryHeight = galleryContainerRef.current.offsetHeight

            if (scrollY >= galleryTop - windowHeight && scrollY <= galleryTop + galleryHeight) {
              const rawProgress = Math.max(0, Math.min(1,
                (scrollY - (galleryTop - windowHeight)) / (windowHeight + galleryHeight)
              ))
              const easedProgress = easeInOutQuad(rawProgress)
              const maxScroll = galleryRef.current.scrollWidth - galleryRef.current.clientWidth
              const scrollPosition = easedProgress * maxScroll

              galleryRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'auto'
              })
            }
          }

          // About section fade effect
          if (aboutSectionRef.current) {
            const aboutTop = aboutSectionRef.current.offsetTop
            const fadeInStart = aboutTop - windowHeight * 0.8
            const fadeInEnd = aboutTop - windowHeight * 0.2
            const fadeInRange = fadeInEnd - fadeInStart

            if (scrollY <= fadeInStart) {
              setAboutOpacity(0)
            } else if (scrollY >= fadeInEnd) {
              setAboutOpacity(1)
            } else {
              const progress = (scrollY - fadeInStart) / fadeInRange
              const easedProgress = easeInOutQuad(progress)
              setAboutOpacity(easedProgress)
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <div
      className="landing-page fade-section"
      ref={landingPageRef}
      style={{
        opacity: landingOpacity,
        transform: `translateY(${(1 - landingOpacity) * 20}px)`,
        transition: 'opacity 0.1s linear, transform 0.1s linear'
      }}
    >
      {/* Header */}
      <header
        className="landing-header fade-section"
        style={{
          opacity: headerOpacity,
          transition: 'opacity 0.1s linear'
        }}
      >
        {/* Left: Brand name with typewriter effect */}
        <div className="brand-name">
          <Typewriter text="Western Vintage Organisation" speed={80} />
        </div>

        {/* Right: Menu with socials and hamburger */}
        <nav className="header-menu">
          {/* Social Icons */}
          <div className="social-icons">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
              </svg>
            </a>
            <a 
              href="https://www.tiktok.com/@the_western.vintage?_r=1&_t=ZM-92hElsBRut2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TikTok"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
              </svg>
            </a>
          </div>

          {/* Hamburger Menu Icon */}
          <button className="hamburger-menu" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {isLoading && (
        <div className="loading">Loading video...</div>
      )}
      {error && (
        <div className="error">
          <p>{error}</p>
          <p>Video path: /mov/landing.mov</p>
          <p>Check browser console for details</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="landing-video"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>

      {/* Video Navigation Bar */}
      <div
        className="video-navigation fade-section"
        style={{
          opacity: landingOpacity,
          transition: 'opacity 0.1s linear'
        }}
      >
        {videos.map((video, index) => (
          <button
            key={index}
            className={`video-nav-item ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => switchVideo(index)}
            aria-label={`Switch to ${video.name}`}
          >
            <span className="video-nav-dot"></span>
          </button>
        ))}
      </div>

      {/* Audio Toggle Button */}
      <button
        className="audio-toggle fade-section"
        style={{
          opacity: landingOpacity,
          transition: 'opacity 0.1s linear'
        }}
        onClick={() => {
          setIsMuted(!isMuted)
          if (videoRef.current) {
            videoRef.current.muted = !isMuted
          }
        }}
        aria-label={isMuted ? "Enable audio" : "Disable audio"}
      >
        {isMuted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
          </svg>
        )}
      </button>
    </div>

    {/* Horizontal Scrolling Gallery Section */}
    <section
      className="gallery-section fade-section"
      ref={galleryContainerRef}
      style={{
        opacity: galleryOpacity,
        transform: `translateY(${(1 - galleryOpacity) * 30}px)`,
        transition: 'opacity 0.1s linear, transform 0.1s linear'
      }}
    >
      <div className="gallery-container" ref={galleryRef}>
        <div className="gallery-content">
          {/* Image 1 - Medium Portrait */}
          <div className="gallery-item image-item image-portrait">
            <div className="image-label-top">VINTAGE FORMAL</div>
            <div className="image-wrapper image-grayscale">
              <img src="/scrolling gallery/IMG_3766.jpg" alt="Vintage Gala Event" />
            </div>
          </div>

          {/* Image 2 - Large Portrait */}
          <div className="gallery-item image-item image-large-portrait">
            <div className="image-label-top">STREETWEAR</div>
            <div className="image-wrapper">
              <img src="/scrolling gallery/IMG_3639.jpg" alt="Western Heritage" />
            </div>
          </div>

          {/* Image 3 - Small Square */}
          <div className="gallery-item image-item image-small-square">
            <div className="image-label-top">URBAN CLASSIC</div>
            <div className="image-wrapper">
              <img src="/scrolling gallery/IMG_3897.jpg" alt="Gala Celebration" />
            </div>
          </div>

          {/* Image 4 - Medium Portrait */}
          <div className="gallery-item image-item image-portrait">
            <div className="image-label-top">RETRO MODERN</div>
            <div className="image-wrapper">
              <img src="/scrolling gallery/IMG_3909.jpg" alt="Vintage Collection" />
            </div>
          </div>

          {/* Image 5 - Small Square */}
          <div className="gallery-item image-item image-small-square">
            <div className="image-label-top">CASUAL ELEGANCE</div>
            <div className="image-wrapper image-grayscale">
              <img src="/scrolling gallery/IMG_3766.jpg" alt="Vintage Collection" />
            </div>
          </div>

          {/* Quote Section */}
          <div className="gallery-item quote-item">
            <blockquote className="gallery-quote">
              "From a young age, Western Vintage was created to shine a light on hidden talents giving young people the confidence, platform, and opportunity to turn their creativity into something meaningful."
            </blockquote>
            <div className="quote-signature">Western Vintage</div>
          </div>
        </div>
      </div>
    </section>

    {/* About Section */}
    <section
      className="about-section fade-section"
      ref={aboutSectionRef}
      style={{
        opacity: aboutOpacity,
        transform: `translateY(${(1 - aboutOpacity) * 30}px)`,
        transition: 'opacity 0.1s linear, transform 0.1s linear'
      }}
    >
      <div className="about-wrapper">
        <div className="about-header">
          <div className="decorative-line"></div>
          <h2 className="about-title">ABOUT US</h2>
          <div className="decorative-line"></div>
        </div>

        <div className="about-content-wrapper">
          <p className="about-description">
            Western Vintage Organization is a youth-driven creative platform in the Western Region of Ghana, focused on empowering young people through fashion, art, and street culture.
          </p>

          <div className="about-mission">
            <h3 className="mission-title">OUR MISSION</h3>
            <p className="mission-text">
              We provide a space where creativity is celebrated, talents are showcased, and young people are inspired to express themselves confidently through authentic self-expression.
            </p>
          </div>

          <div className="about-vision">
            <h3 className="vision-title">OUR VISION</h3>
            <p className="vision-text">
              Through events like the Western Vintage Gala, we aim to build a positive culture that supports youth creativity and shapes a brighter future for the next generation.
            </p>
          </div>
        </div>

        <div className="about-footer">
          <div className="footer-divider"></div>
          <p className="about-tagline">Creativity. Expression. Community.</p>
        </div>
      </div>
    </section>
    </>
  )
}

export default App
