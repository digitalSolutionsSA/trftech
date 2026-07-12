import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ThreeScene from '../../components/ThreeScene'

export default function SecurityHero() {
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
      <div className="service-hero-overlay" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,122,0,0.08) 0%, transparent 60%)' }} />
      <div className="service-hero-content">
        <div className="service-badge" style={{ background: 'rgba(255,122,0,0.08)', border: '1px solid rgba(255,122,0,0.28)', color: 'var(--primary)' }}>
          🛡️ TRF Tech — Professional Security Division
        </div>
        <h1 className="service-hero-title">
          Complete <span>Security</span><br />Installation &amp; Monitoring
        </h1>
        <p className="service-hero-desc">
          Professional installation, commissioning and maintenance of all security systems — alarms, CCTV cameras, access control and electric fencing — carried out by certified technicians.
        </p>
        <div className="service-stats">
          {[['1,500+','Sites Protected'],['24/7','Monitoring Available'],['PSIRA','Registered']].map(([n,l]) => (
            <div key={l}>
              <div className="stat-num" style={{ color: 'var(--primary)' }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
        <div className="cta-buttons">
          <a href="#packages" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) }}>
            View Packages →
          </a>
          <Link to="/#products" className="btn btn-secondary">Shop Products</Link>
        </div>
      </div>
    </section>
  )
}
