import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const STEPS = [
  { num: 1, title: 'Send an Enquiry', desc: 'Tell us about your property and what you want to protect — or send us your equipment list.' },
  { num: 2, title: 'Expert Advice', desc: 'Our team recommends the right equipment for your property and budget, and answers any questions.' },
  { num: 3, title: 'Your Quote', desc: 'You receive a clear, no-obligation quote with pricing and stock availability.' },
  { num: 4, title: 'Order & Delivery', desc: 'Approve the quote and we get your equipment to you, anywhere in South Africa.' },
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
          <h2 className="section-title">Enquiry <span>Process</span></h2>
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
