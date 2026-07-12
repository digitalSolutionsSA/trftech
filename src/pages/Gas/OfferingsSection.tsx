import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const OFFERINGS = [
  { icon: '🚿', title: 'Gas Geysers & Water Heating', desc: 'Instant hot water without electricity. Rinnai, Paloma, Bosch and Speedheat units supplied and installed. Ideal for load-shedding resilience.', list: ['Rinnai 16L–26L units','Bosch Therm series','Flue installation included','Solar retrofit compatible'] },
  { icon: '🍳', title: 'Gas Hobs & Cooking Appliances', desc: 'Convert your kitchen to gas for better temperature control and significant cost savings. Freestanding stoves, built-in hobs and commercial ranges.', list: ['Smeg, Defy, Elba, Bosch hobs','Commercial ranges up to 12-burner','Supply & install or install-only','LPG or natural gas conversion'] },
  { icon: '🔥', title: 'Gas Fireplaces & Heaters', desc: 'Elegant gas fireplaces, patio heaters and radiant heaters for indoor and outdoor spaces. Balanced flue and flueless options with remote control.', list: ['Built-in fireplace installation','Patio radiant heater supply','Outdoor braai gas points','Remote-controlled units'] },
  { icon: '🏭', title: 'Bulk LPG Storage & Reticulation', desc: 'Design and installation of bulk LPG tanks, reticulation pipe networks and manifold systems for estates, lodges, restaurants and industrial facilities.', list: ['500L to 20,000L tanks','Copper & stainless pipework','Multi-point distribution','Pressure regulation systems'] },
  { icon: '🔌', title: 'Gas Generator & Backup Power', desc: 'LPG-fuelled standby generators for homes and businesses. Quieter, cleaner and less maintenance than diesel alternatives.', list: ['5kVA to 50kVA gas generators','Auto-changeover switchgear','Fuel line from existing supply','Load calculation included'] },
  { icon: '📋', title: 'CoC & Compliance Certificates', desc: 'Certificate of Compliance issued for all installations as required by the Pressure Equipment Regulations and SANS 10087. We also certify existing installations.', list: ['SANS 10087 inspection','CoC for property transfers','Leak testing & pressure check','Existing system audits'] },
]

export default function OfferingsSection() {
  useEffect(() => {
    sr.reveal('.gas-offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 120 })
  }, [])

  return (
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
  )
}
