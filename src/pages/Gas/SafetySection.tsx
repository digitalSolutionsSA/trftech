import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const SAFETY = [
  { icon: '🔍', title: 'Leak Testing', desc: 'Every completed installation undergoes a full pressure and leak test before gas is admitted to the system.' },
  { icon: '🌬️', title: 'Ventilation Checks', desc: 'We verify adequate ventilation for all appliances to prevent carbon monoxide buildup.' },
  { icon: '🔧', title: 'Approved Materials', desc: 'Only SANS-approved copper, stainless and CSST flexible pipe used. No substandard materials — ever.' },
  { icon: '📞', title: 'Emergency Support', desc: 'Gas emergency? Our emergency line is available 24/7. We respond to all gas leaks and faults immediately.' },
]

export default function SafetySection() {
  useEffect(() => {
    sr.reveal('.safety-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 120 })
  }, [])

  return (
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
  )
}
