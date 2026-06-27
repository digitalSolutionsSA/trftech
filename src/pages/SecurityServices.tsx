import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollReveal from 'scrollreveal'
import ThreeScene from '../components/ThreeScene'
import Footer from '../components/Footer'
import { showToast } from '../components/Toast'

const OFFERINGS = [
  { icon: '📷', title: 'CCTV & IP Camera Systems', desc: 'Full design, supply and installation of HD, 4K and IP camera networks. NVR/DVR configuration, remote viewing setup and cable management.' },
  { icon: '🔔', title: 'Alarm Systems', desc: 'DSC, Paradox, Ajax and IDS alarm panels installed by certified technicians. Armed response integration, zone mapping and app-based notifications.' },
  { icon: '🚪', title: 'Access Control', desc: 'Biometric fingerprint readers, proximity card systems, PIN keypads and intercom installations. Zkteco, HID and Suprema systems.' },
  { icon: '⚡', title: 'Electric Fencing', desc: 'Supply and installation of electric fence energizers, cable and insulators. SANS 10222 compliant. Zone alarming and perimeter protection.' },
  { icon: '🚗', title: 'Gate Motor Automation', desc: 'Centurion, ET, Nice and Hansa gate motor supply and installation. Intercom integration, remote access app setup and battery backup.' },
  { icon: '🔧', title: 'Maintenance & Repairs', desc: 'Annual service contracts for all security systems. Same-day emergency callouts, camera cleaning, battery replacements and firmware updates.' },
]

const PACKAGES = [
  {
    name: '🔒 Essential',
    desc: 'Perfect for small homes and apartments needing basic security coverage.',
    price: 'R 3,999',
    note: 'Once-off installation',
    features: ['8-Zone alarm panel','2× PIR motion detectors','2× door/window contacts','Outdoor siren with strobe','Smartphone app integration','1-year workmanship guarantee'],
    featured: false,
  },
  {
    name: '🛡️ Advanced',
    desc: 'The most popular choice — comprehensive coverage for medium residential and small commercial sites.',
    price: 'R 8,999',
    note: 'Once-off installation',
    features: ['16-Zone alarm system','4× 4MP IP cameras + NVR','Gate motor installation','Electric fence (50m)','Access control keypad','Armed response integration','Remote monitoring setup','2-year workmanship guarantee'],
    featured: true,
  },
  {
    name: '🏢 Enterprise',
    desc: 'Full commercial security solutions for offices, factories, estates and large properties.',
    price: 'Custom',
    note: 'Contact for quotation',
    features: ['Unlimited zone alarm system','Up to 32 IP cameras','Biometric access control','Full perimeter electric fence','24/7 monitoring link','CCTV AI analytics','Dedicated account manager','3-year service contract'],
    featured: false,
  },
]

const STEPS = [
  { num: 1, title: 'Security Audit', desc: 'Our technician assesses your property\'s vulnerabilities and recommends the optimal security solution.' },
  { num: 2, title: 'System Design', desc: 'We create a detailed system layout, equipment list and cable plan tailored to your property.' },
  { num: 3, title: 'Installation', desc: 'Our certified team installs and configures all equipment. Minimal disruption, neat cable runs.' },
  { num: 4, title: 'Training & Handover', desc: 'We walk you through your new system and ensure you\'re fully confident before we leave.' },
]

export default function SecurityServices() {
  const heroRef  = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType]   = useState('Residential Home')
  const [needs, setNeeds] = useState('')

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
    sr.reveal('.offering-card',  { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
    sr.reveal('.pkg-card',       { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
    sr.reveal('.process-step',   { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
    return () => (sr as any).destroy()
  }, [])

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Assessment Booked!', "We'll call within one business day.")
  }

  return (
    <>
      {/* Hero */}
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
            From single-site alarm installations to enterprise-wide CCTV networks — our PSIRA-registered technicians deliver security solutions that actually work.
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

      {/* Offerings */}
      <section className="offerings-section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Our Expertise</div>
            <h2 className="section-title">Security <span>Solutions</span></h2>
            <p className="section-desc">End-to-end security services from design and installation through to ongoing maintenance and monitoring.</p>
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

      {/* Packages */}
      <section id="packages" className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Choose Your Plan</div>
            <h2 className="section-title">Service <span>Packages</span></h2>
            <p className="section-desc">Flexible packages for every property type and budget. All include a 12-month workmanship guarantee.</p>
          </div>
          <div className="pkg-grid">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="pkg-card offering-card" style={{ position: 'relative', paddingTop: pkg.featured ? 44 : 30, border: pkg.featured ? '1px solid rgba(255,122,0,0.38)' : undefined, boxShadow: pkg.featured ? '0 0 40px rgba(255,122,0,0.08)' : undefined }}>
                {pkg.featured && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', padding: '5px 0' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{pkg.name}</div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.6 }}>{pkg.desc}</p>
                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 3 }}>{pkg.price}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: 20 }}>{pkg.note}</div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`btn btn-full ${pkg.featured ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">How We Work</div>
            <h2 className="section-title">Installation <span>Process</span></h2>
          </div>
          <div className="process-steps">
            {STEPS.map((s) => (
              <div className="process-step" key={s.num}>
                <div className="process-num">{s.num}</div>
                <div className="process-title">{s.title}</div>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="cta-section">
        <div className="container">
          <div className="section-label">Free Assessment</div>
          <h2 className="cta-title">Book a Free <span>Security Assessment</span></h2>
          <p className="cta-desc">Our PSIRA-registered consultant will visit your property at no charge.</p>

          {submitted ? (
            <div className="quote-success">
              <div className="quote-success-icon">✅</div>
              <h3>Assessment Booked!</h3>
              <p>We will call you within one business day to confirm your appointment.</p>
            </div>
          ) : (
            <div className="quote-form-card">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 000 0000" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                    {['Residential Home','Apartment','Small Business','Commercial / Industrial','Estate / Cluster'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group full"><label className="form-label">What security do you need?</label><input className="form-input" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="E.g. cameras, alarm, gate motor..." /></div>
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
                🛡️ Book Free Assessment
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
