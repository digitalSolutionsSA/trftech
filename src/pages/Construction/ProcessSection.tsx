import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const STEPS = [
  { num: 1, title: 'Site Assessment', desc: 'Our team visits your site to take measurements, assess ground conditions, and understand your requirements.' },
  { num: 2, title: 'Design & Quote', desc: 'We provide a detailed design proposal and fully itemised quote — no hidden costs, no surprises.' },
  { num: 3, title: 'Construction', desc: 'Our certified crew begins work on the agreed date. You receive daily progress updates throughout.' },
  { num: 4, title: 'Handover', desc: 'Final inspection with the client, snag list sign-off, and handover of all compliance certificates.' },
]

export default function ProcessSection() {
  useEffect(() => {
    sr.reveal('.process-step', { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
    sr.reveal('.process-section .section-header', { origin: 'top', distance: '30px' })
  }, [])

  return (
    <section className="process-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label" style={{ color: 'var(--primary)' }}>How It Works</div>
          <h2 className="section-title">Our <span>Process</span></h2>
        </div>
        <div className="process-steps">
          {STEPS.map((s) => (
            <div className="process-step" key={s.num}>
              <div className="process-num" style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)' }}>{s.num}</div>
              <div className="process-title">{s.title}</div>
              <p className="process-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
