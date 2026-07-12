import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../../components/Toast'
import ProductCard from '../../components/ProductCard'
import Footer from '../../components/Footer'
import { PRODUCTS } from '../../data/products'
import { sr } from '../../lib/scrollReveal'

const DELIVERY = 250

export default function Cart() {
  const { items, remove, updateQty, clear, total, count } = useCartStore()
  const navigate = useNavigate()

  const subtotal  = total()
  const delivery  = subtotal > 0 ? DELIVERY : 0
  const vat       = Math.round((subtotal + delivery) * 0.15)
  const grandTotal = subtotal + delivery + vat

  const cartIds = items.map((i) => i.id)
  const related = PRODUCTS.filter((p) => !cartIds.includes(p.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  const handleClear = () => {
    if (window.confirm('Clear your entire cart?')) {
      clear()
      showToast('🗑️', 'Cart Cleared', 'All items have been removed.')
    }
  }

  const applyPromo = (code: string) => {
    if (code.toUpperCase() === 'TRFTECH10') {
      showToast('🎉', 'Promo Applied!', '10% discount added.')
    } else {
      showToast('❌', 'Invalid Code', 'That promo code is not valid.')
    }
  }

  useEffect(() => {
    sr.reveal('.cart-item', { origin: 'bottom', distance: '20px', duration: 600, interval: 80 })
  }, [items.length])

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Your <span>Cart</span></h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Cart</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="cart-layout">
          {/* Items */}
          <div>
            {items.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>You haven't added any security products yet.</p>
                <Link to="/" className="btn btn-primary">Shop Now</Link>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-product">
                      <div className="cart-item-thumb" style={{ background: item.gradient }}>{item.icon}</div>
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-cat">{item.category}</div>
                      </div>
                    </div>

                    <div className="cart-item-price">{formatPrice(item.price)}</div>

                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <input
                        className="qty-input"
                        type="number"
                        value={item.qty}
                        min={1}
                        onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                      />
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>

                    <div className="cart-item-total">{formatPrice(item.price * item.qty)}</div>

                    <button className="cart-remove-btn" onClick={() => remove(item.id)} title="Remove">✕</button>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <Link to="/" className="btn btn-secondary">← Continue Shopping</Link>
                  <button onClick={handleClear} className="btn"
                    style={{ color: 'var(--danger)', border: '1px solid rgba(255,71,87,0.3)', background: 'transparent' }}>
                    🗑️ Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="cart-summary-card">
            <div className="cart-summary-title">Order Summary</div>
            <div className="summary-row"><span className="label">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span className="label">Delivery</span><span>{formatPrice(delivery)}</span></div>
            <div className="summary-row"><span className="label">VAT (15%)</span><span>{formatPrice(vat)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>

            <div className="promo-wrap">
              <input className="promo-input" type="text" placeholder="Promo code" id="promo-input" />
              <button className="btn btn-secondary btn-sm"
                onClick={() => applyPromo((document.getElementById('promo-input') as HTMLInputElement).value)}>
                Apply
              </button>
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ fontSize: '1rem', padding: '15px', opacity: items.length === 0 ? 0.4 : 1 }}
              onClick={() => items.length > 0 && navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <div className="secure-note">🔒 Secure checkout — SSL encrypted</div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {['💳 Card', 'EFT', 'PayFast', 'SnapScan'].map((m) => (
                <span key={m} style={{ fontSize: '0.73rem', background: 'rgba(255,255,255,0.06)', padding: '4px 9px', borderRadius: 6, color: 'var(--text-muted)' }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ paddingBottom: 80 }}>
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div className="section-label">You Might Also Like</div>
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Related <span>Products</span></h2>
            </div>
            <div className="products-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  )
}
