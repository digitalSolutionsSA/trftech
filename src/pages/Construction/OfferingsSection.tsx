import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const OFFERINGS = [
  { icon: '🧱', title: 'Boundary Walls & Fencing', desc: 'Brick boundary walls, concrete pre-cast walls and reinforced block walling. All work includes proper footings and foundations.' },
  { icon: '🔩', title: 'Palisade & Steel Fencing', desc: 'Hot-dip galvanised palisade in various heights and spike configurations. Powder-coated steel panels, electric fence integration and anti-climb designs.' },
  { icon: '🏠', title: 'Carports & Shade Structures', desc: 'Steel carports, IBR and polycarbonate roofing, cantilever designs and custom shade structures for residential driveways and commercial parking.' },
  { icon: '🏗️', title: 'Commercial Construction', desc: 'Site clearing, civil groundwork, retaining walls, warehouse construction, office fit-outs and industrial site development. Full project management.' },
  { icon: '🛤️', title: 'Paving & Surfacing', desc: 'Brick paving, tar surfacing, concrete aprons and stormwater drainage for driveways, parking bays and pedestrian walkways.' },
  { icon: '🚧', title: 'Gate Structures & Booms', desc: 'Gate columns, sliding gate tracks, turnstile booths, guardhouses, boom barriers and access control structures.' },
]

export default function OfferingsSection() {
  useEffect(() => {
    sr.reveal('.offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
    sr.reveal('.offerings-section .section-header', { origin: 'top', distance: '30px' })
  }, [])

  return (
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
  )
}
