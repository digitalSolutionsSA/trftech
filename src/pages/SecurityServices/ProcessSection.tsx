import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const STEPS = [
  { num: 1, title: 'Security Audit', desc: 'Our technician assesses your property\'s vulnerabilities and recommends the optimal security solution.' },
  { num: 2, title: 'System Design', desc: 'We create a detailed system layout, equipment list and cable plan tailored to your property.' },
  { num: 3, title: 'Installation', desc: 'Our certified team installs and configures all equipment. Minimal disruption, neat cable runs.' },
  { num: 4, title: 'Training & Handover', desc: 'We walk you through your new system and ensure you\'re fully confident before we leave.' },
]

export default function ProcessSection() {
  useEffect(() => {
    sr.reveal('.process-step', { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
  }, [])

  return (
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
  )
}
