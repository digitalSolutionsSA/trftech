import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const OFFERINGS = [
  { icon: '📷', title: 'CCTV', desc: 'HD, 4K and IP camera systems with NVRs, DVRs and everything needed for remote viewing — plus advice on camera placement and coverage.' },
  { icon: '🔔', title: 'Alarm Systems', desc: 'DSC, Paradox, Ajax and IDS alarm panels, detectors and sirens. Ask us about zone planning, armed-response compatibility and app control.' },
  { icon: '🚪', title: 'Access Control', desc: 'Biometric fingerprint readers, proximity card systems, PIN keypads and intercoms from ZKTeco, HID and Suprema.' },
  { icon: '🚗', title: 'Gate Motors & Accessories', desc: 'Centurion, ET, Nice and Hansa gate motors, plus safety beams, keypads, receivers and all automation accessories.' },
  { icon: '⚡', title: 'Electric Fencing', desc: 'Electric fence energizers, wire, insulators and accessories for SANS 10222-compliant perimeter protection.' },
  { icon: '📡', title: 'Remotes', desc: 'Genuine gate, garage and alarm remotes — including replacements for lost or damaged units.' },
  { icon: '🔋', title: 'Batteries', desc: 'Backup batteries for alarm panels, gate motors, electric fences and UPS systems to keep your security running through load-shedding.' },
  { icon: '🔌', title: 'Cables', desc: 'Quality-rated CCTV, alarm, electric fence and network cabling, made to manufacturer and SANS specifications.' },
]

export default function OfferingsSection() {
  useEffect(() => {
    sr.reveal('.offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
  }, [])

  return (
    <section className="offerings-section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">What We Supply</div>
          <h2 className="section-title">Security <span>Solutions</span></h2>
          <p className="section-desc">Quality security equipment from leading brands, with expert advice to help you choose the right system.</p>
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
