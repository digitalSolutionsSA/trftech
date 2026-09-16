import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCartStore, formatPrice } from '../../store/cartStore'
import { showToast } from '../Toast'
import type { DbProduct } from '../../types'

interface Props { product: DbProduct }

export default function ProductCard({ product: p }: Props) {
  const add = useCartStore((s) => s.add)
  const [added, setAdded]     = useState(false)
  const [wished, setWished]   = useState(false)
  const [open, setOpen]       = useState(false)
  const [variantId, setVariantId] = useState<string | null>(null)

  const variants = (p.product_variants ?? []).filter((v) => v.is_active)
  const hasVariants = variants.length > 0
  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === variantId) ?? variants[0]
    : null

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
    add(p, selectedVariant ?? undefined)
    showToast('✅', 'Added to Cart', selectedVariant ? `${p.name} — ${selectedVariant.label}` : p.name)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const activePrice      = selectedVariant ? Number(selectedVariant.price) : Number(p.price)
  const activeCompareAt  = selectedVariant ? selectedVariant.compare_at_price : p.compare_at_price
  const activeImage      = selectedVariant?.image_url ?? p.image_url
  const activeStock      = selectedVariant ? selectedVariant.stock : p.stock
  const inStock          = activeStock > 0
  const discount         = activeCompareAt ? Math.round((1 - activePrice / activeCompareAt) * 100) : null

  const cardImage   = p.image_url ?? variants.find((v) => v.image_url)?.image_url ?? null
  const cardInStock = hasVariants ? variants.some((v) => v.stock > 0) : p.stock > 0
  const minPrice    = hasVariants ? Math.min(...variants.map((v) => Number(v.price))) : null

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(p.rating) ? '★' : '☆').join('')

  const cardMedia = cardImage ? (
    <img
      src={cardImage}
      alt={p.name}
      className="pc-img"
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
    />
  ) : (
    <div className="pc-img" style={{ background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
      {p.icon}
    </div>
  )

  return (
    <>
      <div className="pc-card" onClick={() => setOpen(true)}>
        {/* Image area */}
        <div className="pc-image">
          {cardMedia}

          {/* Badges */}
          <div className="pc-badges">
            {p.badge && <span className={`pc-badge ${p.badge_class ?? ''}`}>{p.badge}</span>}
            {!hasVariants && discount && <span className="pc-badge pc-badge-discount">-{discount}%</span>}
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
          {!cardInStock && <div className="pc-out-of-stock">Out of Stock</div>}
        </div>

        {/* Info area */}
        <div className="pc-body">
          <div className="pc-category">{p.categories?.name ?? ''}</div>
          <div className="pc-name">{p.name}</div>

          <div className="pc-rating">
            <span className="pc-stars">{stars}</span>
            <span className="pc-rating-count">({p.review_count})</span>
          </div>

          <div className="pc-pricing">
            {hasVariants ? (
              <span className="pc-price">From {formatPrice(minPrice!)}</span>
            ) : (
              <>
                <span className="pc-price">{formatPrice(Number(p.price))}</span>
                {p.compare_at_price && <span className="pc-old-price">{formatPrice(Number(p.compare_at_price))}</span>}
              </>
            )}
          </div>

          <button
            className={`pc-add-btn${added ? ' added' : ''}${!cardInStock ? ' disabled' : ''}`}
            onClick={hasVariants ? (e) => { e.stopPropagation(); setOpen(true) } : handleAdd}
            disabled={!cardInStock}
          >
            {hasVariants ? 'Select Options' : (added ? '✓ Added to Cart' : '+ Add to Cart')}
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="pq-overlay" onClick={() => setOpen(false)}>
          <div className="pq-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pq-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            <div className="pq-media">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={p.name}
                  className="pq-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
                />
              ) : (
                <div className="pq-img" style={{ background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                  {p.icon}
                </div>
              )}
              <div className="pq-badges">
                {p.badge && <span className={`pc-badge ${p.badge_class ?? ''}`}>{p.badge}</span>}
                {discount && <span className="pc-badge pc-badge-discount">-{discount}%</span>}
              </div>
            </div>

            <div className="pq-info">
              <div className="pc-category">{p.categories?.name ?? ''}</div>
              <h3 className="pq-name">{p.name}</h3>

              <div className="pc-rating">
                <span className="pc-stars">{stars}</span>
                <span className="pc-rating-count">({p.review_count} reviews)</span>
              </div>

              <div className="pc-pricing">
                <span className="pc-price">{formatPrice(activePrice)}</span>
                {activeCompareAt && <span className="pc-old-price">{formatPrice(Number(activeCompareAt))}</span>}
              </div>

              {p.description && <p className="pq-desc">{p.description}</p>}

              {hasVariants && (
                <div className="pq-variants">
                  <div className="pq-variants-label">Choose an option</div>
                  <div className="pq-variant-list">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`pq-variant-btn${selectedVariant?.id === v.id ? ' active' : ''}${v.stock === 0 ? ' oos' : ''}`}
                        onClick={() => setVariantId(v.id)}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={`pq-stock ${inStock ? 'in' : 'out'}`}>
                {inStock ? '● In Stock — ready to ship' : '● Currently Out of Stock'}
              </div>

              <div className="pq-actions">
                <button
                  className={`pc-add-btn${added ? ' added' : ''}${!inStock ? ' disabled' : ''}`}
                  onClick={handleAdd}
                  disabled={!inStock}
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
