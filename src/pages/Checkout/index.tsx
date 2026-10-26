import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../../components/Toast'
import Footer from '../../components/Footer'

type Step = 1 | 2 | 3
type DeliveryMethod = 'standard' | 'express'

const DELIVERY_COSTS: Record<DeliveryMethod, number> = { standard: 250, express: 450 }
const DELIVERY_LABELS: Record<DeliveryMethod, string> = { standard: 'Standard (2–5 days)', express: 'Express (Next Day)' }

// Orders are sent as a WhatsApp request — 084 555 9862 in international format
const WHATSAPP_NUMBER = '27845559862'

export default function Checkout() {
  const { items, total, clear } = useCartStore()
  const navigate = useNavigate()

  const [step, setStep]         = useState<Step>(1)
  const [orderNum, setOrderNum] = useState('')
  const [waLink, setWaLink]     = useState('')

  // Step 1
  const [fname, setFname]   = useState('')
  const [lname, setLname]   = useState('')
  const [email, setEmail]   = useState('')
  const [phone, setPhone]   = useState('')

  // Step 2
  const [address, setAddress]   = useState('')
  const [city, setCity]         = useState('')
  const [province, setProvince] = useState('')
  const [postal, setPostal]     = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')

  const subtotal   = total()
  const deliveryCost = DELIVERY_COSTS[delivery]
  const vat        = Math.round((subtotal + deliveryCost) * 0.15)
  const grandTotal = subtotal + deliveryCost + vat

  const validate = (s: Step): boolean => {
    if (s === 1) {
      if (!fname || !lname || !email || !phone) { showToast('⚠️', 'Missing Details', 'Fill in all required fields.'); return false }
      if (!/\S+@\S+\.\S+/.test(email))          { showToast('⚠️', 'Invalid Email', 'Enter a valid email address.'); return false }
    }
    if (s === 2) {
      if (!address || !city || !province || !postal) { showToast('⚠️', 'Missing Details', 'Complete all delivery fields.'); return false }
    }
    return true
  }

  const goTo = (target: Step) => {
    if (target > step && !validate(step)) return
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildMessage = (num: string) => [
    `Hi TRF Tech, I'd like to place an order. Please confirm stock availability.`,
    ``,
    `*Order ${num}*`,
    ``,
    `*Items*`,
    ...items.map((i) => `• ${i.name.trim()} × ${i.qty} — ${formatPrice(i.price * i.qty)}`),
    ``,
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery – ${DELIVERY_LABELS[delivery]}: ${formatPrice(deliveryCost)}`,
    `VAT (15%): ${formatPrice(vat)}`,
    `*Total: ${formatPrice(grandTotal)}*`,
    ``,
    `*Customer*`,
    `${fname} ${lname}`,
    email,
    phone,
    ``,
    `*Delivery address*`,
    address,
    `${city}, ${province} ${postal}`,
    ``,
    `Are all of these items currently in stock?`,
  ].join('\n')

  const placeOrder = () => {
    if (items.length === 0) { showToast('⚠️', 'Empty Cart', 'Add products before ordering.'); return }
    const num  = 'TRF-' + Date.now().toString().slice(-6)
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(num))}`
    window.open(link, '_blank', 'noopener')
    setOrderNum(num)
    setWaLink(link)
    clear()
    showToast('💬', 'Opening WhatsApp', `Send the message to submit order #${num}.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepLabels = ['Your Details', 'Delivery', 'Review']

  if (orderNum) {
    return (
      <>
        <div className="page-header">
          <div className="container">
            <h1 className="page-header-title">Order <span>Request</span></h1>
          </div>
        </div>
        <div className="container">
          <div className="order-success" style={{ padding: '80px 20px' }}>
            <div className="success-icon">💬</div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: 'var(--success)', marginBottom: 12 }}>Almost Done!</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 12px' }}>
              Your order has been written into a WhatsApp message. Press <strong>send</strong> in WhatsApp and
              we'll confirm stock availability and payment details with you.
            </p>
            <div className="success-order-num">Order #{orderNum}</div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">💬 Open WhatsApp Again</a>
              <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Secure <span>Checkout</span></h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / <span>Checkout</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Steps indicator */}
        <div className="checkout-steps" style={{ marginTop: 40 }}>
          {stepLabels.map((label, i) => {
            const n = (i + 1) as Step
            const cls = n < step ? 'completed' : n === step ? 'active' : ''
            return (
              <div key={label} style={{ display: 'contents' }}>
                <div className={`checkout-step ${cls}`}>
                  <div className="step-num">{n < step ? '✓' : n}</div>
                  <div className="step-label">{label}</div>
                </div>
                {i < stepLabels.length - 1 && <div className="step-line" />}
              </div>
            )
          })}
        </div>

        <div className="checkout-layout">
          {/* Left: form */}
          <div>
            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="form-section">
                  <div className="form-section-title">👤 Personal Information</div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="John" /></div>
                    <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Smith" /></div>
                    <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" /></div>
                    <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 000 0000" /></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => goTo(2)}>Continue to Delivery →</button>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="form-section">
                  <div className="form-section-title">🚚 Delivery Address</div>
                  <div className="form-grid">
                    <div className="form-group full"><label className="form-label">Street Address *</label><input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" /></div>
                    <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Johannesburg" /></div>
                    <div className="form-group">
                      <label className="form-label">Province *</label>
                      <select className="form-select" value={province} onChange={(e) => setProvince(e.target.value)}>
                        <option value="">Select Province</option>
                        {['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'].map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Postal Code *</label><input className="form-input" value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="2196" maxLength={4} /></div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-title">📦 Delivery Method</div>
                  {([['standard','Standard Delivery (2–5 days)','R 250 — Courier to your door','🚚'],['express','Express Delivery (Next day)','R 450 — Guaranteed next business day','⚡']] as const).map(([key, name, desc, icon]) => (
                    <div key={key} className={`payment-option${delivery === key ? ' active' : ''}`} onClick={() => setDelivery(key)}>
                      <input type="radio" name="delivery" readOnly checked={delivery === key} />
                      <div style={{ flex: 1 }}>
                        <div className="payment-option-name">{name}</div>
                        <div className="payment-option-desc">{desc}</div>
                      </div>
                      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <button className="btn btn-secondary" onClick={() => goTo(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => goTo(3)}>Review Order →</button>
                </div>
              </>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <>
                <div className="form-section">
                  <div className="form-section-title">✅ Review Your Order</div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {[
                      ['Contact', `${fname} ${lname}\n${email}\n${phone}`],
                      ['Delivery Address', `${address}\n${city}, ${province} ${postal}`],
                      ['Delivery', DELIVERY_LABELS[delivery]],
                    ].map(([label, val]) => (
                      <div key={label as string} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label as string}</div>
                        <div style={{ fontSize: '0.87rem', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{val as string}</div>
                      </div>
                    ))}

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                        Items ({items.reduce((s,i) => s + i.qty, 0)})
                      </div>
                      {items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.87rem' }}>
                          <span>{item.icon} {item.name} <span style={{ color: 'var(--text-muted)' }}>×{item.qty}</span></span>
                          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <button className="btn btn-secondary" onClick={() => goTo(2)}>← Back</button>
                  <button className="btn btn-orange" style={{ fontSize: '1rem', padding: '14px 32px' }} onClick={placeOrder}>
                    💬 Send Order via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: order summary */}
          <div className="checkout-summary-card">
            <div className="cart-summary-title">Your Order</div>
            {items.map((item) => (
              <div className="summary-item" key={item.id}>
                <div className="summary-item-thumb" style={{ background: item.gradient }}>{item.icon}</div>
                <div>
                  <div className="summary-item-name">{item.name}</div>
                  <div className="summary-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="summary-item-price">{formatPrice(item.price * item.qty)}</div>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="summary-row"><span className="label">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="summary-row"><span className="label">Delivery</span><span>{formatPrice(deliveryCost)}</span></div>
              <div className="summary-row"><span className="label">VAT (15%)</span><span>{formatPrice(vat)}</span></div>
              <div className="summary-row total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            </div>
            <div className="secure-note" style={{ marginTop: 18 }}>💬 We'll confirm stock and payment on WhatsApp</div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
