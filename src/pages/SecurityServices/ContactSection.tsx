import { useEffect, useState } from 'react'
import { showToast } from '../../components/Toast'
import { submitEnquiry } from '../../lib/enquiries'

const KIT_EVENT = 'trf:kit-enquiry'

/** Scroll to the enquiry form with a kit already filled in (used by the kit cards). */
export function enquireAbout(kit: string) {
  window.dispatchEvent(new CustomEvent<string>(KIT_EVENT, { detail: kit }))
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType]   = useState('Residential Home')
  const [needs, setNeeds] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const onKit = (e: Event) => setNeeds(`${(e as CustomEvent<string>).detail} — please quote`)
    window.addEventListener(KIT_EVENT, onKit)
    return () => window.removeEventListener(KIT_EVENT, onKit)
  }, [])

  const handleSubmit = async () => {
    if (!name || !phone || !email) { showToast('⚠️', 'Missing Details', 'Fill in your name, phone and email.'); return }
    setSending(true)
    try {
      await submitEnquiry({ source: 'security', name, phone, email, property_type: type, service: 'Security enquiry', message: needs })
      setSubmitted(true)
      showToast('✅', 'Enquiry Sent!', "We'll get back to you within one business day.")
    } catch {
      showToast('⚠️', 'Not Sent', "Sorry, your enquiry didn't go through. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <div className="section-label">Enquiries</div>
        <h2 className="cta-title">Send a <span>Security Enquiry</span></h2>
        <p className="cta-desc">Tell us what you need and our team will come back to you with advice and a no-obligation quote.</p>

        {submitted ? (
          <div className="quote-success">
            <div className="quote-success-icon">✅</div>
            <h3>Enquiry Sent!</h3>
            <p>We'll get back to you within one business day with advice and a quote.</p>
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
              <div className="form-group full"><label className="form-label">What do you need?</label><input className="form-input" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="E.g. 4 cameras + NVR, AJAX alarm kit, gate motor..." /></div>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20, fontSize: '1rem', padding: 14 }} onClick={handleSubmit} disabled={sending}>
              {sending ? 'Sending…' : '🛡️ Send Enquiry'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
