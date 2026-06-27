import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollReveal from 'scrollreveal'
import ThreeScene from '../components/ThreeScene'
import Footer from '../components/Footer'
import { showToast } from '../components/Toast'

const OFFERINGS = [
  { icon: '🚿', title: 'Gas Geysers & Water Heating', desc: 'Instant hot water without electricity. Rinnai, Paloma, Bosch and Speedheat units supplied and installed. Ideal for load-shedding resilience.', list: ['Rinnai 16L–26L units','Bosch Therm series','Flue installation included','Solar retrofit compatible'] },
  { icon: '🍳', title: 'Gas Hobs & Cooking Appliances', desc: 'Convert your kitchen to gas for better temperature control and significant cost savings. Freestanding stoves, built-in hobs and commercial ranges.', list: ['Smeg, Defy, Elba, Bosch hobs','Commercial ranges up to 12-burner','Supply & install or install-only','LPG or natural gas conversion'] },
  { icon: '🔥', title: 'Gas Fireplaces & Heaters', desc: 'Elegant gas fireplaces, patio heaters and radiant heaters for indoor and outdoor spaces. Balanced flue and flueless options with remote control.', list: ['Built-in fireplace installation','Patio radiant heater supply','Outdoor braai gas points','Remote-controlled units'] },
  { icon: '🏭', title: 'Bulk LPG Storage & Reticulation', desc: 'Design and installation of bulk LPG tanks, reticulation pipe networks and manifold systems for estates, lodges, restaurants and industrial facilities.', list: ['500L to 20,000L tanks','Copper & stainless pipework','Multi-point distribution','Pressure regulation systems'] },
  { icon: '🔌', title: 'Gas Generator & Backup Power', desc: 'LPG-fuelled standby generators for homes and businesses. Quieter, cleaner and less maintenance than diesel alternatives.', list: ['5kVA to 50kVA gas generators','Auto-changeover switchgear','Fuel line from existing supply','Load calculation included'] },
  { icon: '📋', title: 'CoC & Compliance Certificates', desc: 'Certificate of Compliance issued for all installations as required by the Pressure Equipment Regulations and SANS 10087. We also certify existing installations.', list: ['SANS 10087 inspection','CoC for property transfers','Leak testing & pressure check','Existing system audits'] },
]

const SAFETY = [
  { icon: '🔍', title: 'Leak Testing', desc: 'Every completed installation undergoes a full pressure and leak test before gas is admitted to the system.' },
  { icon: '🌬️', title: 'Ventilation Checks', desc: 'We verify adequate ventilation for all appliances to prevent carbon monoxide buildup.' },
  { icon: '🔧', title: 'Approved Materials', desc: 'Only SANS-approved copper, stainless and CSST flexible pipe used. No substandard materials — ever.' },
  { icon: '📞', title: 'Emergency Support', desc: 'Gas emergency? Our emergency line is available 24/7. We respond to all gas leaks and faults immediately.' },
]

const STEPS = [
  { num: 1, title: 'Consultation', desc: 'We discuss your requirements, assess your site, and recommend the safest and most cost-effective solution.' },
  { num: 2, title: 'Detailed Quote', desc: 'A fully itemised quote including all materials, labour and the CoC certificate fee. No hidden extras.' },
  { num: 3, title: 'Certified Installation', desc: 'Our registered LP Gas Practitioners complete the installation safely and neatly, to the letter of SANS 10087.' },
  { num: 4, title: 'CoC Issued', desc: 'After inspection and testing, your Certificate of Compliance is issued on the same day as installation.' },
]

export default function Gas() {
  const heroRef  = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [email, setEmail]   = useState('')
  const [service, setService] = useState('Gas Geyser Installation')
  const [propType, setPropType] = useState('Residential Home')
  const [city, setCity]     = useState('')

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
    sr.reveal('.gas-offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 120 })
    sr.reveal('.safety-card',       { origin: 'bottom', distance: '30px', duration: 700, interval: 120 })
    sr.reveal('.process-step',      { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
    return () => (sr as any).destroy()
  }, [])

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Quote Submitted!', "We'll be in touch within one business day.")
  }

  return (
    <>
      {/* Hero */}
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
            Professional LPG gas installations for residential and commercial properties across South Africa. All work is SANS 10087 compliant and includes a full Certificate of Compliance.
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

      {/* Offerings */}
      <section className="offerings-section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: '#ff7a00' }}>What We Install</div>
            <h2 className="section-title">Gas <span style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Installation Services</span></h2>
            <p className="section-desc">Complete LPG solutions for every application — from single gas hobs to full commercial installations with bulk storage and reticulation.</p>
          </div>
          <div className="offerings-grid">
            {OFFERINGS.map((o) => (
              <div className="offering-card gas-offering-card" key={o.title} style={{ borderTop: '3px solid #ff7a00' }}>
                <div className="offering-icon">{o.icon}</div>
                <div className="offering-title">{o.title}</div>
                <p className="offering-desc" style={{ marginBottom: 14 }}>{o.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {o.list.map((item) => (
                    <li key={item} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#ff7a00', fontWeight: 700 }}>→</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Compliance strip */}
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg,rgba(255,122,0,0.06),rgba(0,212,255,0.04))', border: '1px solid rgba(255,122,0,0.16)', borderRadius: 'var(--radius-lg)', padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem' }}>📜</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Orbitron,sans-serif', color: '#ff7a00', fontSize: '1.05rem', marginBottom: 8 }}>Fully Licensed &amp; Compliant</div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>All installations are carried out by registered LP Gas Practitioners under LPGSASA registration. Every job receives a full Certificate of Compliance (CoC).</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['LPGSASA\nRegistered','SANS\n10087','CoC\nIssued'].map((b) => (
                <div key={b} style={{ background: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.3)', color: '#ff7a00', padding: '10px 16px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', whiteSpace: 'pre' }}>{b}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: 60, paddingBottom: 60 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: '#ff7a00' }}>Safety First</div>
            <h2 className="section-title">Gas <span>Safety Standards</span></h2>
          </div>
          <div className="safety-grid">
            {SAFETY.map((s) => (
              <div key={s.title} className="safety-card feature-card" style={{ borderColor: 'rgba(255,122,0,0.15)', background: 'rgba(255,122,0,0.03)' }}>
                <span className="feature-icon">{s.icon}</span>
                <div className="feature-title">{s.title}</div>
                <p className="feature-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: '#ff7a00' }}>Our Approach</div>
            <h2 className="section-title">Installation <span>Process</span></h2>
          </div>
          <div className="process-steps">
            {STEPS.map((s) => (
              <div className="process-step" key={s.num}>
                <div className="process-num" style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)' }}>{s.num}</div>
                <div className="process-title">{s.title}</div>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="gas-quote" className="cta-section">
        <div className="container">
          <div className="section-label" style={{ color: '#ff7a00' }}>Free Quotation</div>
          <h2 className="cta-title">Request Your <span style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Free Gas Quote</span></h2>
          <p className="cta-desc">Tell us what you need and we'll get back to you with a competitive quote within one business day.</p>

          {submitted ? (
            <div className="quote-success">
              <div className="quote-success-icon">✅</div>
              <h3 style={{ color: '#ff7a00' }}>Quote Request Received!</h3>
              <p>Our certified gas team will contact you within one business day. Thank you!</p>
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
                    {['Gas Geyser Installation','Gas Hob / Stove','Gas Fireplace','Bulk LPG Storage','Gas Generator','CoC Certificate Only','Other / Not Sure'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select className="form-select" value={propType} onChange={(e) => setPropType(e.target.value)}>
                    {['Residential Home','Apartment / Flat','Restaurant / Hospitality','Commercial / Industrial','Estate / Lodge'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">City / Area</label><input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="E.g. Johannesburg" /></div>
              </div>
              <button className="btn btn-green btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
                🔥 Request Free Gas Quote
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
