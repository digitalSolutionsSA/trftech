import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'
import { SCIENCE_GRADIENT, SCIENCE_RANGES } from './shared'

export default function OfferingsSection() {
  useEffect(() => {
    sr.reveal('.offering-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 130 })
    sr.reveal('.offerings-section .section-header', { origin: 'top', distance: '30px' })
  }, [])

  return (
    <section id="ranges" className="offerings-section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label" style={{ color: '#00c9a7' }}>What We Supply</div>
          <h2 className="section-title">TRF Science <span style={{ background: SCIENCE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Ranges</span></h2>
          <p className="section-desc">Four ranges covering everything from daily consumables to specialised instruments. Need something not listed? Ask us for a quote.</p>
        </div>
        <div className="offerings-grid">
          {SCIENCE_RANGES.map((r) => (
            <div className="offering-card" id={r.id} key={r.id} style={{ scrollMarginTop: 100 }}>
              <div className="offering-icon">{r.icon}</div>
              <div className="offering-title">{r.title}</div>
              <p className="offering-desc">{r.desc}</p>
              <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {r.items.map((item) => (
                  <li key={item} style={{
                    fontSize: '0.75rem', padding: '3px 9px', borderRadius: 999,
                    background: 'rgba(0,201,167,0.10)', border: '1px solid rgba(0,201,167,0.25)', color: '#00c9a7',
                  }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
