import { useState } from 'react'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../Toast'
import type { DbProduct } from '../../types'

interface Props { product: DbProduct }

export default function ProductCard({ product: p }: Props) {
  const add = useCartStore((s) => s.add)
  const [added, setAdded]   = useState(false)
  const [wished, setWished] = useState(false)

  const handleAdd = () => {
    add(p)
    showToast('✅', 'Added to Cart', p.name)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const discount = p.compare_at_price
    ? Math.round((1 - p.price / p.compare_at_price) * 100)
    : null

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(p.rating) ? '★' : '☆').join('')
  const inStock = p.stock > 0

  return (
    <div className="pc-card">
      <div className="pc-image">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="pc-img"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
          />
        ) : (
          <div className="pc-img" style={{ background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            {p.icon}
          </div>
        )}

        <div className="pc-badges">
          {p.badge && <span className={`pc-badge ${p.badge_class ?? ''}`}>{p.badge}</span>}
          {discount && <span className="pc-badge pc-badge-discount">-{discount}%</span>}
        </div>

        <button
          className={`pc-wishlist${wished ? ' wished' : ''}`}
          onClick={(e) => { e.stopPropagation(); setWished((v) => !v) }}
          aria-label="Wishlist"
        >
          {wished ? '♥' : '♡'}
        </button>

        {!inStock && <div className="pc-out-of-stock">Out of Stock</div>}
      </div>

      <div className="pc-body">
        <div className="pc-category">{p.categories?.name ?? ''}</div>
        <div className="pc-name">{p.name}</div>

        <div className="pc-rating">
          <span className="pc-stars">{stars}</span>
          <span className="pc-rating-count">({p.review_count})</span>
        </div>

        <div className="pc-pricing">
          <span className="pc-price">{formatPrice(Number(p.price))}</span>
          {p.compare_at_price && <span className="pc-old-price">{formatPrice(Number(p.compare_at_price))}</span>}
        </div>

        <button
          className={`pc-add-btn${added ? ' added' : ''}${!inStock ? ' disabled' : ''}`}
          onClick={handleAdd}
          disabled={!inStock}
        >
          {added ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  )
}
