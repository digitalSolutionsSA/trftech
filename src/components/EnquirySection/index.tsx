import { useState } from 'react'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="enquiry" className="enquiry-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Other Services</div>
          <h2 className="section-title">Construction &amp; <span>Gas</span></h2>
          <p className="section-desc">
            Beyond security, we offer expert construction and certified gas installation services. Request a free quote below.
          </p>
        </div>

        <div className="enq-layout">
          {/* Service cards */}
          <div className="enq-cards">
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
          <div className="enq-form-wrap">
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
                      rows={3} placeholder="Tell us more about your project..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">
                    Send Enquiry →
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
