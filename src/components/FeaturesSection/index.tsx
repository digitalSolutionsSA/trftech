import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const FEATURES = [
  { icon: '🚚', title: 'Fast Nationwide Delivery',    desc: 'Same-day dispatch on in-stock items. Deliveries across all provinces within 2–5 business days.' },
  { icon: '🔧', title: 'Expert Installation',         desc: 'Our certified technicians offer professional installation services. All installs carry a 12-month workmanship guarantee.' },
  { icon: '🛡️', title: 'Manufacturer Warranty',       desc: 'All products carry full manufacturer warranty — 1 to 5 years. We handle all warranty claims on your behalf.' },
  { icon: '💬', title: '24/7 Technical Support',      desc: 'Our technical team is available around the clock for support, remote diagnostics, and emergency callouts.' },
]

export default function FeaturesSection() {
  useEffect(() => {
    sr.reveal('.features-section .section-header', { origin: 'top', distance: '30px', duration: 700 })
    sr.reveal('.feature-card', { origin: 'bottom', distance: '40px', duration: 800, interval: 130 })
  }, [])

  return (
    <section id="features" className="section features-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Why TRF Tech</div>
          <h2 className="section-title">The <span>TRF Advantage</span></h2>
          <p className="section-desc">
            We go beyond selling products — we deliver peace of mind backed by expertise, quality, and ongoing support.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
