import { useState } from 'react'
import { showToast } from '../../components/Toast'

export default function QuoteSection() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [email, setEmail]   = useState('')
  const [service, setService] = useState('Gas Geyser Installation')
  const [propType, setPropType] = useState('Residential Home')
  const [city, setCity]     = useState('')

  const handleSubmit = () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSubmitted(true)
    showToast('✅', 'Quote Submitted!', "We'll be in touch within one business day.")
  }

  return (
    <section id="gas-quote" className="cta-section">
      <div className="container">
        <div className="section-label" style={{ color: '#ff7a00' }}>Free Quotation</div>
        <h2 className="cta-title">Request Your <span style={{ background: 'linear-gradient(135deg,#ff7a00,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Free Gas Quote</span></h2>
        <p className="cta-desc">Tell us what you need and we'll get back to you with a competitive quote within one business day.</p>

        {submitted ? (
          <div className="quote-success">
            <div className="quote-success-icon">✅</div>
            <h3 style={{ color: '#ff7a00' }}>Quote Request Received!</h3>
            <p>Our certified gas team will contact you within one business day. Thank you!</p>
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
                  {['Gas Geyser Installation','Gas Hob / Stove','Gas Fireplace','Bulk LPG Storage','Gas Generator','CoC Certificate Only','Other / Not Sure'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select className="form-select" value={propType} onChange={(e) => setPropType(e.target.value)}>
                  {['Residential Home','Apartment / Flat','Restaurant / Hospitality','Commercial / Industrial','Estate / Lodge'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">City / Area</label><input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="E.g. Vereeniging" /></div>
            </div>
            <button className="btn btn-green btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit}>
              🔥 Request Free Gas Quote
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
