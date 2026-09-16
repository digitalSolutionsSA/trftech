import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../Toast'
import type { Product } from '../../types'

interface Props { product: Product }

export default function ProductCard({ product: p }: Props) {
  const add = useCartStore((s) => s.add)
  const [added, setAdded]   = useState(false)
  const [wished, setWished] = useState(false)
  const [open, setOpen]     = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const handleAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    add(p)
    showToast('✅', 'Added to Cart', p.name)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discount = p.oldPrice
    ? Math.round((1 - p.price / p.oldPrice) * 100)
    : null

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(p.rating) ? '★' : '☆').join('')

  return (
    <>
      <div className="pc-card" onClick={() => setOpen(true)}>
        {/* Image area */}
        <div className="pc-image">
          <img
            src={p.imageUrl}
            alt={p.name}
            className="pc-img"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
          />

          {/* Badges */}
          <div className="pc-badges">
            {p.badge && <span className={`pc-badge ${p.badgeClass ?? ''}`}>{p.badge}</span>}
            {discount && <span className="pc-badge pc-badge-discount">-{discount}%</span>}
          </div>

          {/* Wishlist */}
          <button
            className={`pc-wishlist${wished ? ' wished' : ''}`}
            onClick={(e) => { e.stopPropagation(); setWished((v) => !v) }}
            aria-label="Wishlist"
          >
            {wished ? '♥' : '♡'}
          </button>

          {/* Stock status */}
          {!p.inStock && <div className="pc-out-of-stock">Out of Stock</div>}
        </div>

        {/* Info area */}
        <div className="pc-body">
          <div className="pc-category">{p.categoryLabel}</div>
          <div className="pc-name">{p.name}</div>

          <div className="pc-rating">
            <span className="pc-stars">{stars}</span>
            <span className="pc-rating-count">({p.reviews})</span>
          </div>

          <div className="pc-pricing">
            <span className="pc-price">{formatPrice(p.price)}</span>
            {p.oldPrice && <span className="pc-old-price">{formatPrice(p.oldPrice)}</span>}
          </div>

          <button
            className={`pc-add-btn${added ? ' added' : ''}${!p.inStock ? ' disabled' : ''}`}
            onClick={handleAdd}
            disabled={!p.inStock}
          >
            {added ? '✓ Added to Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="pq-overlay" onClick={() => setOpen(false)}>
          <div className="pq-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pq-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            <div className="pq-media">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="pq-img"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
              />
              <div className="pq-badges">
                {p.badge && <span className={`pc-badge ${p.badgeClass ?? ''}`}>{p.badge}</span>}
                {discount && <span className="pc-badge pc-badge-discount">-{discount}%</span>}
              </div>
            </div>

            <div className="pq-info">
              <div className="pc-category">{p.categoryLabel}</div>
              <h3 className="pq-name">{p.name}</h3>

              <div className="pc-rating">
                <span className="pc-stars">{stars}</span>
                <span className="pc-rating-count">({p.reviews} reviews)</span>
              </div>

              <div className="pc-pricing">
                <span className="pc-price">{formatPrice(p.price)}</span>
                {p.oldPrice && <span className="pc-old-price">{formatPrice(p.oldPrice)}</span>}
              </div>

              <p className="pq-desc">{p.desc}</p>

              <div className={`pq-stock ${p.inStock ? 'in' : 'out'}`}>
                {p.inStock ? '● In Stock — ready to ship' : '● Currently Out of Stock'}
              </div>

              <div className="pq-actions">
                <button
                  className={`pc-add-btn${added ? ' added' : ''}${!p.inStock ? ' disabled' : ''}`}
                  onClick={handleAdd}
                  disabled={!p.inStock}
                >
                  {added ? '✓ Added to Cart' : '+ Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
