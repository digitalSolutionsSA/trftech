import { useState } from 'react'
import { submitEnquiry } from '../../lib/enquiries'

const OTHER_SERVICES = [
  {
    icon: '🏗️',
    title: 'Construction Services',
    desc: 'Boundary walls, palisade fencing, carports, site preparation and full commercial builds — by our certified construction team.',
    items: ['Boundary Walls', 'Palisade Fencing', 'Carports', 'Site Setup', 'Commercial Builds'],
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: '🔥',
    title: 'Gas Installations',
    desc: 'Safe, certified LPG installations for residential and commercial properties — gas geysers, stoves, fireplaces and bulk storage, SANS compliant.',
    items: ['Gas Geysers', 'Gas Hobs & Stoves', 'Fireplaces', 'Bulk Storage', 'CoC Certificates'],
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop',
  },
]

export default function EnquirySection() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setFailed(false)
    try {
      await submitEnquiry({ source: 'home', ...form })
      setSent(true)
      setForm({ name: '', phone: '', service: '', message: '' })
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="enquiry" className="enquiry-section">
      <div className="container">
        <div className="sec-head">
          <p className="hud-label eyebrow2"><span data-scramble>Enquiries // request a quote</span></p>
          <h2 className="display sec-title" data-glitch>Send an <span className="text-armed">Enquiry</span></h2>
          <p className="sec-sub" data-sr="rise" data-sr-delay="150">
            Need a quote on security equipment, advice on the right system, or help with a construction or
            gas project? Send us an enquiry and we'll get back to you.
          </p>
        </div>

        <div className="enq-layout">
          {/* Service cards */}
          <div className="enq-cards" data-sr-children="left" data-sr-interval="160">
            {OTHER_SERVICES.map((s) => (
              <div className="enq-card" key={s.title}>
                <div className="enq-card-img-wrap">
                  <img src={s.img} alt={s.title} className="enq-card-img" loading="lazy" />
                  <div className="enq-card-overlay" />
                  <div className="enq-card-header">
                    <span className="enq-card-icon">{s.icon}</span>
                    <span className="enq-card-title">{s.title}</span>
                  </div>
                </div>
                <div className="enq-card-body">
                  <p className="enq-card-desc">{s.desc}</p>
                  <ul className="enq-card-list">
                    {s.items.map((item) => (
                      <li key={item}>
                        <span className="enq-check">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Quote form */}
          <div className="enq-form-wrap" data-sr="right" data-sr-delay="120">
            {sent ? (
              <div className="enq-success">
                <div className="enq-success-icon">✅</div>
                <h3>Enquiry Received!</h3>
                <p>We'll get back to you within 24 hours with a free quote.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setSent(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <div className="enq-form-title">Request a Free Quote</div>
                <p className="enq-form-subtitle">Fill in your details and we'll contact you within 24 hours.</p>
                <form className="enq-form" onSubmit={handleSubmit}>
                  <div className="enq-field">
                    <label>Full Name</label>
                    <input
                      type="text" required placeholder="John Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="enq-field">
                    <label>Phone Number</label>
                    <input
                      type="tel" required placeholder="082 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="enq-field">
                    <label>Service Required</label>
                    <select
                      required
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option value="">Select a service...</option>
                      <option>Security — Product Quote</option>
                      <option>Security — AJAX Alarm Systems</option>
                      <option>Security — Advice on a System</option>
                      <option>Security — Bulk / Trade Order</option>
                      <option>Construction — Boundary Wall</option>
                      <option>Construction — Palisade Fencing</option>
                      <option>Construction — Carport</option>
                      <option>Construction — Other</option>
                      <option>Gas — Geyser Installation</option>
                      <option>Gas — Stove / Hob</option>
                      <option>Gas — Bulk Storage</option>
                      <option>Gas — CoC Certificate</option>
                    </select>
                  </div>
                  <div className="enq-field">
                    <label>Message (optional)</label>
                    <textarea
                      rows={3} placeholder="Tell us what you need — products, quantities or your project..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  {failed && (
                    <p className="enq-error" role="alert">
                      Sorry, your enquiry didn't go through. Please try again.
                    </p>
                  )}
                  <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                    {sending ? 'Sending…' : 'Send Enquiry →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
