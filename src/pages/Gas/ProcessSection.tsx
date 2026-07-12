import { useEffect } from 'react'
import { sr } from '../../lib/scrollReveal'

const STEPS = [
  { num: 1, title: 'Consultation', desc: 'We discuss your requirements, assess your site, and recommend the safest and most cost-effective solution.' },
  { num: 2, title: 'Detailed Quote', desc: 'A fully itemised quote including all materials, labour and the CoC certificate fee. No hidden extras.' },
  { num: 3, title: 'Certified Installation', desc: 'Our registered LP Gas Practitioners complete the installation safely and neatly, to the letter of SANS 10087.' },
  { num: 4, title: 'CoC Issued', desc: 'After inspection and testing, your Certificate of Compliance is issued on the same day as installation.' },
]

export default function ProcessSection() {
  useEffect(() => {
    sr.reveal('.process-step', { origin: 'bottom', distance: '30px', duration: 700, interval: 150 })
  }, [])

  return (
    <section className="process-section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label" style={{ color: '#ff7a00' }}>Our Approach</div>
          <h2 className="section-title">Installation <span>Process</span></h2>
        </div>
        <div className="process-steps">
          {STEPS.map((s) => (
            <div className="process-step" key={s.num}>
              <div className="process-num" style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)' }}>{s.num}</div>
              <div className="process-title">{s.title}</div>
              <p className="process-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
