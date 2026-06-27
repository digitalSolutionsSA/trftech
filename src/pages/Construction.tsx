import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollReveal from 'scrollreveal'
import ThreeScene from '../components/ThreeScene'
import Footer from '../components/Footer'
import { showToast } from '../components/Toast'

const OFFERINGS = [
  { icon: '🧱', title: 'Boundary Walls & Fencing', desc: 'Brick boundary walls, concrete pre-cast walls and reinforced block walling. All work includes proper footings and foundations.' },
  { icon: '🔩', title: 'Palisade & Steel Fencing', desc: 'Hot-dip galvanised palisade in various heights and spike configurations. Powder-coated steel panels, electric fence integration and anti-climb designs.' },
  { icon: '🏠', title: 'Carports & Shade Structures', desc: 'Steel carports, IBR and polycarbonate roofing, cantilever designs and custom shade structures for residential driveways and commercial parking.' },
  { icon: '🏗️', title: 'Commercial Construction', desc: 'Site clearing, civil groundwork, retaining walls, warehouse construction, office fit-outs and industrial site development. Full project management.' },
  { icon: '🛤️', title: 'Paving & Surfacing', desc: 'Brick paving, tar surfacing, concrete aprons and stormwater drainage for driveways, parking bays and pedestrian walkways.' },
  { icon: '🚧', title: 'Gate Structures & Booms', desc: 'Gate columns, sliding gate tracks, turnstile booths, guardhouses, boom barriers and access control structures.' },
]

const STEPS = [
  { num: 1, title: 'Site Assessment', desc: 'Our team visits your site to take measurements, assess ground conditions, and understand your requirements.' },
  { num: 2, title: 'Design & Quote', desc: 'We provide a detailed design proposal and fully itemised quote — no hidden costs, no surprises.' },
  { num: 3, title: 'Construction', desc: 'Our certified crew begins work on the agreed date. You receive daily progress updates throughout.' },
  { num: 4, title: 'Handover', desc: 'Final inspection with the client, snag list sign-off, and handover of all compliance certificates.' },
]

export default function Construction() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [email, setEmail]     = useState('')
  const [service, setService] = useState('Boundary Wall')
  const [desc, setDesc]       = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.service-badge',      { y: 30, opacity: 0, duration: 0.7, delay: 0.3 })
        gsap.from('.service-hero-title', { y: 50, opacity: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' })
        gsap.from('.service-hero-desc',  { y: 30, opacity: 0, duration: 0.7, delay: 0.7 })
        gsap.from('.stat-num',           { y: 30, opacity: 0, stagger: 0.12, duration: 0.6, delay: 0.9 })
      }, heroRef)
      return () => ctx.revert()
    }
  }, [])

  useEffect(() => {
    const sr = ScrollReveal({ reset: false })
    sr.reveal('.offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
    sr.reveal('.process-step',  { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
    sr.reveal('.offerings-section .section-header', { origin: 'top', distance: '30px' })
    sr.reveal('.process-section .section-header',   { origin: 'top', distance: '30px' })
    return () => (sr as any).destroy()
  }, [])

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Quote Submitted!', "We'll be in touch soon.")
  }

  return (
    <>
      {/* Hero */}
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
            From boundary walls and palisade fencing to commercial structures — TRF Tech's construction team delivers precision craftsmanship backed by engineering expertise and NHBRC certification.
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

      {/* Offerings */}
      <section className="offerings-section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: 'var(--primary)' }}>What We Build</div>
            <h2 className="section-title">Construction <span style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Services</span></h2>
            <p className="section-desc">We handle every aspect of construction — meeting all South African building codes and safety standards.</p>
          </div>
          <div className="offerings-grid">
            {OFFERINGS.map((o) => (
              <div className="offering-card" key={o.title}>
                <div className="offering-icon">{o.icon}</div>
                <div className="offering-title">{o.title}</div>
                <p className="offering-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: 'var(--primary)' }}>How It Works</div>
            <h2 className="section-title">Our <span>Process</span></h2>
          </div>
          <div className="process-steps">
            {STEPS.map((s) => (
              <div className="process-step" key={s.num}>
                <div className="process-num" style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)' }}>{s.num}</div>
                <div className="process-title">{s.title}</div>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="cta-section">
        <div className="container">
          <div className="section-label" style={{ color: 'var(--primary)' }}>Free Quotation</div>
          <h2 className="cta-title">Get Your <span style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Free Quote</span></h2>
          <p className="cta-desc">Fill in the form and one of our construction specialists will contact you within one business day.</p>

          {submitted ? (
            <div className="quote-success">
              <div className="quote-success-icon">✅</div>
              <h3>Quote Request Sent!</h3>
              <p>Our team will contact you within one business day. Thank you!</p>
            </div>
          ) : (
            <div className="quote-form-card">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 000 0000" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
                <div className="form-group">
                  <label className="form-label">Service Required</label>
                  <select className="form-select" value={service} onChange={(e) => setService(e.target.value)}>
                    {['Boundary Wall','Palisade Fencing','Carport / Shade Structure','Commercial Construction','Paving & Surfacing','Gate Structure','Other'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group full"><label className="form-label">Project Description</label><input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description..." /></div>
              </div>
              <button className="btn btn-orange btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
                🏗️ Request Free Quote
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
