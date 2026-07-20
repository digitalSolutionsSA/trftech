import { useRef, useState } from 'react'
import gsap from 'gsap'
import ProductCard from '../ProductCard'
import { PRODUCTS } from '../../data/products'
import type { Product } from '../../types'

type FilterKey = 'all' | Product['category']

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all',              label: 'All Products',    icon: '🛍️' },
  { key: 'gate-motors',      label: 'Gate Motors',     icon: '⚙️' },
  { key: 'cameras',          label: 'CCTV Cameras',    icon: '📷' },
  { key: 'electric-fencing', label: 'Electric Fencing',icon: '⚡' },
  { key: 'alarm-systems',    label: 'Alarm Systems',   icon: '🔔' },
]

export default function ProductsSection() {
  const [active, setActive] = useState<FilterKey>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)

  const handleFilter = (key: FilterKey) => {
    if (!gridRef.current) { setActive(key); return }
    gsap.to(gridRef.current.querySelectorAll('.pc-card'), {
      opacity: 0, y: 8, duration: 0.15, stagger: 0.02,
      onComplete: () => {
        setActive(key)
        requestAnimationFrame(() => {
          gsap.from(gridRef.current!.querySelectorAll('.pc-card'), {
            opacity: 0, y: 20, duration: 0.32, stagger: 0.04, ease: 'power2.out',
          })
        })
      },
    })
  }

  const counts: Record<FilterKey, number> = {
    all:              PRODUCTS.length,
    'gate-motors':    PRODUCTS.filter((p) => p.category === 'gate-motors').length,
    cameras:          PRODUCTS.filter((p) => p.category === 'cameras').length,
    'electric-fencing': PRODUCTS.filter((p) => p.category === 'electric-fencing').length,
    'alarm-systems':  PRODUCTS.filter((p) => p.category === 'alarm-systems').length,
  }

  return (
    <section id="products" className="products-section">
      <div className="container">
        {/* Section header */}
        <div className="ps-header">
          <div>
            <div className="section-label">Shop Online</div>
            <h2 className="section-title">Security <span>Products</span></h2>
            <p className="section-desc" style={{ textAlign: 'left', margin: 0 }}>
              Premium security hardware from the world's leading brands, delivered across South Africa.
            </p>
          </div>
          <div className="ps-result-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="ps-layout">
          {/* Sidebar */}
          <aside className="ps-sidebar">
            <div className="ps-sidebar-title">Categories</div>
            <ul className="ps-cat-list">
              {FILTERS.map((f) => (
                <li key={f.key}>
                  <button
                    className={`ps-cat-btn${active === f.key ? ' active' : ''}`}
                    onClick={() => handleFilter(f.key)}
                  >
                    <span className="ps-cat-icon">{f.icon}</span>
                    <span className="ps-cat-label">{f.label}</span>
                    <span className="ps-cat-count">{counts[f.key]}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="ps-sidebar-divider" />

            <div className="ps-sidebar-title">In Stock Only</div>
            <label className="ps-toggle-label">
              <input type="checkbox" className="ps-toggle-input" defaultChecked />
              <span className="ps-toggle-track"><span className="ps-toggle-thumb" /></span>
              Show available items
            </label>

            <div className="ps-sidebar-divider" />

            <div className="ps-sidebar-title">Top Brands</div>
            <div className="ps-brand-list">
              {['Centurion', 'Hikvision', 'Dahua', 'Nemtek', 'DSC', 'Paradox', 'Ajax', 'Gallagher'].map((b) => (
                <span key={b} className="ps-brand-chip">{b}</span>
              ))}
            </div>
          </aside>

          {/* Product grid */}
          <div className="ps-main">
            {/* Mobile filter pills */}
            <div className="ps-filter-pills">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`ps-pill${active === f.key ? ' active' : ''}`}
                  onClick={() => handleFilter(f.key)}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            <div className="pc-grid" ref={gridRef}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
