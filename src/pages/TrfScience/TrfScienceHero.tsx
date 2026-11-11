import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ThreeScene from '../../components/ThreeScene'
import { SCIENCE_GRADIENT, scrollToSection } from './shared'

export default function TrfScienceHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.service-badge',      { y: 30, opacity: 0, duration: 0.7, delay: 0.3 })
      gsap.from('.service-hero-title', { y: 50, opacity: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' })
      gsap.from('.service-hero-desc',  { y: 30, opacity: 0, duration: 0.7, delay: 0.7 })
      gsap.from('.stat-num',           { y: 30, opacity: 0, stagger: 0.12, duration: 0.6, delay: 0.9 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="service-hero" ref={heroRef}>
      <ThreeScene className="service-hero-canvas" accentColor={0x00c9a7} />
      <div className="service-hero-overlay" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,201,167,0.08) 0%, transparent 60%)' }} />
      <div className="service-hero-content">
        <div className="service-badge" style={{ background: 'rgba(0,201,167,0.10)', border: '1px solid rgba(0,201,167,0.3)', color: '#00c9a7' }}>
          🔬 TRF Science
        </div>
        <h1 className="service-hero-title">
          Everything Your<br />
          <span style={{ background: SCIENCE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Laboratory
          </span><br />
          Needs
        </h1>
        <p className="service-hero-desc">
          Lab supplies, lab equipment, chemicals and glassware for schools, universities, industry and research labs —
          sourced and delivered by TRF Science.
        </p>
        <div className="service-stats">
          {[['4', 'Product Ranges'], ['SA', 'Wide Delivery'], ['1 Day', 'Quote Turnaround']].map(([n, l]) => (
            <div key={l}>
              <div className="stat-num" style={{ color: '#00c9a7' }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
        <div className="cta-buttons">
          <a href="#quote" className="btn btn-primary" style={{ background: SCIENCE_GRADIENT, color: '#00110d' }}
            onClick={(e) => { e.preventDefault(); scrollToSection('quote') }}>
            Request a Quote →
          </a>
          <a href="#ranges" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); scrollToSection('ranges') }}>
            Browse Our Ranges
          </a>
          <Link to="/#products" className="btn btn-secondary">Shop Online</Link>
        </div>
      </div>
    </section>
  )
}
