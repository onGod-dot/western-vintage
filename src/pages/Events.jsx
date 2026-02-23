import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Events.css'

// Replace with real video IDs from your TikTok URLs: tiktok.com/@the_western.vintage/video/VIDEO_ID
const TIKTOK_VIDEO_IDS = [
  '7321234567890123456',
  '7321234567890123457',
  '7321234567890123458'
]

function Events() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.header-menu')) setMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  const nextSlide = () => {
    setCarouselIndex((i) => (i + 1) % TIKTOK_VIDEO_IDS.length)
  }

  const prevSlide = () => {
    setCarouselIndex((i) => (i - 1 + TIKTOK_VIDEO_IDS.length) % TIKTOK_VIDEO_IDS.length)
  }

  return (
    <div className="events-page">
      <header className="events-header">
        <Link to="/" className="events-brand">
          Western Vintage
          <span className="events-brand-dot"></span>
        </Link>
        <nav className="events-nav">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="events-social" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" fill="currentColor"/></svg>
          </a>
          <a href="https://www.tiktok.com/@the_western.vintage" target="_blank" rel="noopener noreferrer" className="events-social" aria-label="TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/></svg>
          </a>
          <div className="events-hamburger-wrap">
            <button type="button" className="events-hamburger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            {menuOpen && (
              <div className="events-dropdown">
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="events-main">
        <section className="events-hero">
          <h1 className="events-title">Events</h1>
          <p className="events-subtitle">Western Vintage Gala &amp; more</p>
        </section>

        <section className="events-videos-section">
          <div className="events-videos-inner">
            <div className="events-carousel">
              <button type="button" className="events-carousel-btn events-carousel-prev" aria-label="Previous" onClick={prevSlide}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              <div className="events-carousel-viewport">
                <div
                  className="events-carousel-track"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {TIKTOK_VIDEO_IDS.map((id, i) => (
                    <div key={id} className="events-carousel-slide">
                      <div className="events-tiktok-embed">
                        <iframe
                          src={`https://www.tiktok.com/embed/v2/${id}`}
                          width="325"
                          height="575"
                          frameBorder="0"
                          allowFullScreen
                          title={`TikTok video ${i + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="events-carousel-btn events-carousel-next" aria-label="Next" onClick={nextSlide}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <div className="events-carousel-dots">
              {TIKTOK_VIDEO_IDS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`events-dot ${i === carouselIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCarouselIndex(i)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="events-footer">
        <div className="events-footer-inner">
          <div className="events-footer-col events-footer-brand">
            <span className="events-footer-logo">Western Vintage</span>
            <span className="events-footer-dot"></span>
          </div>
          <div className="events-footer-col">
            <h4 className="events-footer-heading">Socials</h4>
            <ul className="events-footer-links">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@the_western.vintage" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>
          <div className="events-footer-col">
            <h4 className="events-footer-heading">Discover</h4>
            <ul className="events-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Events
