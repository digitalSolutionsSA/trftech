import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'
import { enquireAbout } from './ContactSection'

// Equipment bundles to start a conversation from — supply only, priced per enquiry
const PACKAGES = [
  {
    name: '🔒 Essential Kit',
    desc: 'Basic alarm coverage for small homes and apartments.',
    price: 'Price on enquiry',
    note: 'Equipment kit — tailored to your property',
    features: ['8-Zone alarm panel','2× PIR motion detectors','2× door/window contacts','Outdoor siren with strobe','Smartphone app control'],
    featured: false,
  },
  {
    name: '🛡️ Advanced Kit',
    desc: 'The most popular choice — comprehensive equipment for medium homes and small businesses.',
    price: 'Price on enquiry',
    note: 'Equipment kit — tailored to your property',
    features: ['16-Zone alarm system','4× 4MP IP cameras + NVR','Gate motor kit','Electric fence energizer + 50m kit','Access control keypad','Armed-response compatible'],
    featured: true,
  },
  {
    name: '🏢 Commercial',
    desc: 'Larger systems for offices, factories, estates and big properties.',
    price: 'Custom quote',
    note: 'Volume and trade pricing available',
    features: ['Unlimited-zone alarm system','Up to 32 IP cameras','Biometric access control','Full perimeter electric fence equipment','CCTV with AI analytics','Bulk / trade pricing'],
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
          <div className="section-label">Popular Kits</div>
          <h2 className="section-title">Security <span>Kits</span></h2>
          <p className="section-desc">Starting points for common properties. Every site is different, so send us an enquiry and we'll tailor the kit and quote you.</p>
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
                onClick={(e) => { e.preventDefault(); enquireAbout(pkg.name.replace(/^\S+\s/, '')) }}>
                Enquire About This Kit
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
