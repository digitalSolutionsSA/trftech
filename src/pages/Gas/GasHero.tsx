import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ThreeScene from '../../components/ThreeScene'

export default function GasHero() {
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
      <ThreeScene className="service-hero-canvas" accentColor={0xff7a00} />
      <div className="service-hero-overlay" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,122,0,0.07) 0%, transparent 60%)' }} />
      <div className="service-hero-content">
        <div className="service-badge" style={{ background: 'rgba(255,122,0,0.09)', border: '1px solid rgba(255,122,0,0.3)', color: '#ff7a00' }}>
          🔥 TRF Tech — Certified Gas Division
        </div>
        <h1 className="service-hero-title">
          Safe, Certified<br />
          <span style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            LPG Gas Solutions
          </span>
        </h1>
        <p className="service-hero-desc">
          Safe, certified LPG installations for residential or commercial properties. Gas geysers, stoves, fireplaces and bulk storage systems — installed according to SANS standards, with a full Certificate of Compliance.
        </p>
        <div className="service-stats">
          {[['600+','Gas Installs'],['SANS','10087 Compliant'],['CoC','Issued Same Day']].map(([n,l]) => (
            <div key={l}>
              <div className="stat-num" style={{ color: '#ff7a00' }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
        <div className="cta-buttons">
          <a href="#gas-quote" className="btn btn-green" onClick={(e) => { e.preventDefault(); document.getElementById('gas-quote')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Get a Free Quote →
          </a>
          <Link to="/#products" className="btn btn-secondary">View Products</Link>
        </div>
      </div>
    </section>
  )
}
