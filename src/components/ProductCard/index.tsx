import { useState } from 'react'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../Toast'
import type { Product } from '../../types'
import { CATEGORY_IMAGES } from '../../data/categoryImages'

interface Props {
  product: Product
}

export default function ProductCard({ product: p }: Props) {
  const add = useCartStore((s) => s.add)
  const [added, setAdded] = useState(false)
  const [wished, setWished] = useState(false)

  const handleAdd = () => {
    add(p)
    showToast('✅', 'Added to Cart', p.name)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating))

  return (
    <div className="product-card">
      <div className="product-image">
        <div
          className="product-img-bg"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.45) 0%, rgba(10,10,14,0.08) 32%, rgba(10,10,14,0.15) 60%, rgba(10,10,14,0.9) 100%), url(${CATEGORY_IMAGES[p.category]})` }}
        />
        <div className="product-img-icon">{p.icon}</div>

        {p.badge && (
          <div className="product-badge-wrap">
            <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
          </div>
        )}

        <button
          className="product-wishlist"
          onClick={() => setWished((v) => !v)}
          title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{ color: wished ? 'var(--danger)' : undefined }}
        >
          {wished ? '❤️' : '♡'}
        </button>
      </div>

      <div className="product-info">
        <div className="product-cat-label">{p.categoryLabel}</div>
        <div className="product-name">{p.name}</div>
        <div className="product-desc">{p.desc}</div>

        <div className="product-rating">
          {stars}
          <span>{p.rating} ({p.reviews} reviews)</span>
        </div>

        <div className="product-footer">
          <div>
            <div className="product-price">{formatPrice(p.price)}</div>
            {p.oldPrice && (
              <div className="product-old-price">{formatPrice(p.oldPrice)}</div>
            )}
          </div>

          <button
            className={`add-cart-btn${added ? ' added' : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
