import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'
import { SCIENCE_GRADIENT } from './shared'

const STEPS = [
  { num: 1, title: 'Send Your List', desc: 'Tell us what you need — a single item or a full lab list. Use the form below or send us an enquiry.' },
  { num: 2, title: 'Get a Quote', desc: 'We source your items and send you a clear, itemised quote.' },
  { num: 3, title: 'Confirm Your Order', desc: 'Approve the quote and we prepare your order.' },
  { num: 4, title: 'Delivery', desc: 'Your supplies are packed carefully and delivered to your school, lab or business.' },
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
          <div className="section-label" style={{ color: '#00c9a7' }}>How It Works</div>
          <h2 className="section-title">Ordering <span>Made Simple</span></h2>
        </div>
        <div className="process-steps">
          {STEPS.map((s) => (
            <div className="process-step" key={s.num}>
              <div className="process-num" style={{ background: SCIENCE_GRADIENT }}>{s.num}</div>
              <div className="process-title">{s.title}</div>
              <p className="process-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
