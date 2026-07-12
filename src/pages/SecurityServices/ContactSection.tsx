import { useState } from 'react'
import { showToast } from '../../components/Toast'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType]   = useState('Residential Home')
  const [needs, setNeeds] = useState('')

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Assessment Booked!', "We'll call within one business day.")
  }

  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <div className="section-label">Free Assessment</div>
        <h2 className="cta-title">Book a Free <span>Security Assessment</span></h2>
        <p className="cta-desc">Our PSIRA-registered consultant will visit your property at no charge.</p>

        {submitted ? (
          <div className="quote-success">
            <div className="quote-success-icon">✅</div>
            <h3>Assessment Booked!</h3>
            <p>We will call you within one business day to confirm your appointment.</p>
          </div>
        ) : (
          <div className="quote-form-card">
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 000 0000" /></div>
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  {['Residential Home','Apartment','Small Business','Commercial / Industrial','Estate / Cluster'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group full"><label className="form-label">What security do you need?</label><input className="form-input" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="E.g. cameras, alarm, gate motor..." /></div>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
              🛡️ Book Free Assessment
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
