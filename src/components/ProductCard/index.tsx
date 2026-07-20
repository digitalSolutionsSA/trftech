import { useState } from 'react'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../Toast'
import type { Product } from '../../types'

interface Props { product: Product }

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

  const discount = p.oldPrice
    ? Math.round((1 - p.price / p.oldPrice) * 100)
    : null

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(p.rating) ? '★' : '☆').join('')

  return (
    <div className="pc-card">
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
  )
}
