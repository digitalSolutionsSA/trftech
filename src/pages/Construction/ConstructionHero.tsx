import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ThreeScene from '../../components/ThreeScene'

export default function ConstructionHero() {
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
      <ThreeScene className="service-hero-canvas" accentColor={0xff6b35} />
      <div className="service-hero-overlay" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,122,0,0.07) 0%, transparent 60%)' }} />
      <div className="service-hero-content">
        <div className="service-badge" style={{ background: 'rgba(255,122,0,0.10)', border: '1px solid rgba(255,122,0,0.3)', color: 'var(--primary)' }}>
          🏗️ TRF Tech — Construction Division
        </div>
        <h1 className="service-hero-title">
          Building the<br />
          <span style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Foundations
          </span><br />
          of Security
        </h1>
        <p className="service-hero-desc">
          From boundary walls and palisade fencing to full commercial buildings — and the maintenance thereof. TRF Tech's construction team delivers precision craftsmanship backed by engineering expertise and NHBRC certification.
        </p>
        <div className="service-stats">
          {[['450+','Projects Completed'],['12','Years Experience'],['100%','NHBRC Certified']].map(([n,l]) => (
            <div key={l}>
              <div className="stat-num" style={{ color: 'var(--primary)' }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
        <div className="cta-buttons">
          <a href="#quote" className="btn btn-orange" onClick={(e) => { e.preventDefault(); document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Get a Free Quote →
          </a>
          <Link to="/#products" className="btn btn-secondary">View Products</Link>
        </div>
      </div>
    </section>
  )
}
