import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ThreeScene from '../ThreeScene'

const HERO_IMG = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80&auto=format&fit=crop'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.7 })
      tl.from('.hero-badge',    { y: 40, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
        .from('.hero-title',    { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .from('.hero-cta',      { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from('.hero-stat',     { y: 30, opacity: 0, stagger: 0.12, duration: 0.5 },      '-=0.3')
        .from('.hero-scroll',   { opacity: 0, duration: 0.5 },                             '-=0.2')
        .from('.hero-visual',   { scale: 0.8, opacity: 0, duration: 1, ease: 'elastic.out(1,0.6)' }, '<-1.5')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      {/* Unsplash background image */}
      <div
        className="hero-bg-img"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <ThreeScene className="hero-canvas" />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div>
          <div className="hero-badge">
            <span className="badge-dot" />
            Trusted Security Solutions — South Africa
          </div>

          <h1 className="hero-title">
            Next-Gen<br />
            <span>Security &amp;</span><br />
            Technology
          </h1>

          <p className="hero-subtitle">
            TRF Tech delivers cutting-edge security systems for homes and businesses across South Africa — from gate automation to smart surveillance and beyond.
          </p>

          <div className="hero-cta">
            <a href="#products" className="btn btn-primary"
              onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Shop Now →
            </a>
            <a href="#services" className="btn btn-secondary"
              onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Our Services
            </a>
          </div>

          <div className="hero-stats">
            {[
              { num: '1,500+', label: 'Installations' },
              { num: '12',     label: 'Years Experience' },
              { num: '98%',    label: 'Client Satisfaction' },
            ].map((s) => (
              <div className="hero-stat" key={s.label}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — animated shield */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="hero-visual">
            <div className="orbit orbit-1"><div className="orbit-dot" /></div>
            <div className="orbit orbit-2"><div className="orbit-dot" /></div>
            <div className="orbit orbit-3"><div className="orbit-dot" /></div>
            <svg className="hero-shield-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#ff7a00" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffb347" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d="M100 10 L180 40 L180 120 Q180 180 100 220 Q20 180 20 120 L20 40 Z"
                fill="url(#sg)" fillOpacity="0.14" stroke="url(#sg)" strokeWidth="2" filter="url(#glow)" />
              <path d="M100 30 L165 55 L165 120 Q165 168 100 200 Q35 168 35 120 L35 55 Z"
                fill="url(#sg)" fillOpacity="0.07" stroke="url(#sg)" strokeWidth="1" strokeOpacity="0.4" />
              <image href="/logo-plain.png" x="50" y="75" width="100" height="100" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0 0 6px #ff7a00aa)' }} />
              <line x1="60" y1="90" x2="75" y2="90" stroke="#ff7a00" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="75" y1="90" x2="75" y2="75" stroke="#ff7a00" strokeWidth="1" strokeOpacity="0.5" />
              <circle cx="75" cy="75" r="2.5" fill="#ff7a00" fillOpacity="0.7" />
              <line x1="140" y1="90" x2="125" y2="90" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="125" y1="90" x2="125" y2="75" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
              <circle cx="125" cy="75" r="2.5" fill="#ffb347" fillOpacity="0.7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        Scroll
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
