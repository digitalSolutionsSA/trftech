import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const OFFERINGS = [
  { icon: '📷', title: 'CCTV', desc: 'Full design, supply and installation of HD, 4K and IP camera systems. NVR/DVR configuration, remote viewing setup and professional cable management.' },
  { icon: '🔔', title: 'Alarm Systems', desc: 'DSC, Paradox, Ajax and IDS alarm panels installed by certified technicians. Armed response integration, zone mapping and app-based notifications.' },
  { icon: '🚪', title: 'Access Control', desc: 'Biometric fingerprint readers, proximity card systems, PIN keypads and intercom installations. ZKTeco, HID and Suprema systems supplied and fitted.' },
  { icon: '🚗', title: 'Gate Motors & Accessories', desc: 'Centurion, ET, Nice and Hansa gate motor supply and installation, plus safety beams, keypads, receivers and all automation accessories.' },
  { icon: '⚡', title: 'Electric Fencing', desc: 'Supply and installation of electric fence energizers, cable and insulators. SANS 10222 compliant, with zone alarming and perimeter protection.' },
  { icon: '📡', title: 'Remotes', desc: 'Genuine and cloned gate, garage and alarm remotes programmed and supplied on-site — including replacements for lost or damaged units.' },
  { icon: '🔋', title: 'Batteries', desc: 'Backup batteries for alarm panels, gate motors, electric fences and UPS systems — supplied, tested and replaced to keep your security running through load-shedding.' },
  { icon: '🔌', title: 'Cables', desc: 'Quality-rated CCTV, alarm, electric fence and network cabling, supplied and neatly installed to manufacturer and SANS specifications.' },
]

export default function OfferingsSection() {
  useEffect(() => {
    sr.reveal('.offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
  }, [])

  return (
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
  )
}
