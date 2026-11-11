import { useState } from 'react'
import { showToast } from '../../components/Toast'
import { submitEnquiry } from '../../lib/enquiries'
import { SCIENCE_GRADIENT, SCIENCE_RANGES } from './shared'

const OPTIONS = [...SCIENCE_RANGES.map((r) => r.title), 'Other / Mixed Order']

export default function QuoteSection() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [email, setEmail]     = useState('')
  const [service, setService] = useState(OPTIONS[0])
  const [desc, setDesc]       = useState('')

  const handleSubmit = async () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSending(true)
    try {
      // Saved with the other enquiries, so it shows in the admin Enquiries tab
      await submitEnquiry({ source: 'home', name, phone, email, service: `TRF Science — ${service}`, message: desc })
      setSubmitted(true)
      showToast('✅', 'Quote Request Sent!', "We'll be in touch soon.")
    } catch {
      showToast('⚠️', 'Could Not Send', 'Please try again, or contact us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="quote" className="cta-section">
      <div className="container">
        <div className="section-label" style={{ color: '#00c9a7' }}>Request a Quote</div>
        <h2 className="cta-title">Get a <span style={{ background: SCIENCE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Quote</span></h2>
        <p className="cta-desc">Send us what you need and the TRF Science team will get back to you within one business day.</p>

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
                <label className="form-label">Range</label>
                <select className="form-select" value={service} onChange={(e) => setService(e.target.value)}>
                  {OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group full"><label className="form-label">What do you need?</label><input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Items, quantities, school / lab name..." /></div>
            </div>
            <button className="btn btn-primary btn-full" disabled={sending}
              style={{ marginTop: 20, fontSize: '1rem', padding: 14, background: SCIENCE_GRADIENT, color: '#00110d' }}
              onClick={handleSubmit}>
              {sending ? 'Sending…' : '🔬 Request a Quote'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
