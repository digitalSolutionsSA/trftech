import { useState } from 'react'
import { showToast } from '../../components/Toast'

export default function QuoteSection() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [email, setEmail]     = useState('')
  const [service, setService] = useState('Boundary Wall')
  const [desc, setDesc]       = useState('')

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Quote Submitted!', "We'll be in touch soon.")
  }

  return (
    <section id="quote" className="cta-section">
      <div className="container">
        <div className="section-label" style={{ color: 'var(--primary)' }}>Free Quotation</div>
        <h2 className="cta-title">Get Your <span style={{ background: 'linear-gradient(135deg,#ff7a00,#ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Free Quote</span></h2>
        <p className="cta-desc">Fill in the form and one of our construction specialists will contact you within one business day.</p>

        {submitted ? (
          <div className="quote-success">
            <div className="quote-success-icon">✅</div>
            <h3>Quote Request Sent!</h3>
            <p>Our team will contact you within one business day. Thank you!</p>
          </div>
        ) : (
          <div className="quote-form-card">
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 000 0000" /></div>
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
              <div className="form-group">
                <label className="form-label">Service Required</label>
                <select className="form-select" value={service} onChange={(e) => setService(e.target.value)}>
                  {['Boundary Wall','Palisade Fencing','Carport / Shade Structure','Commercial Construction','Paving & Surfacing','Gate Structure','Other'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group full"><label className="form-label">Project Description</label><input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description..." /></div>
            </div>
            <button className="btn btn-orange btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
              🏗️ Request Free Quote
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
