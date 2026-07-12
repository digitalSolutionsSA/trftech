import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

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

export default function PackagesSection() {
  useEffect(() => {
    sr.reveal('.pkg-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
  }, [])

  return (
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
  )
}
