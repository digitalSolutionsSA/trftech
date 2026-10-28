import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'
import ProductCard from '../ProductCard'
import { usePublicProducts } from '../../hooks/useProducts'
import { FILTERS, onShopFilter, type FilterKey } from './filters'

/** Cards rendered per page: 500+ products at once made the page crawl, so they come in pages. */
const PAGE = 24

export default function ProductsSection() {
  const [active, setActive] = useState<FilterKey>('all')
  const [limit, setLimit] = useState(PAGE)
  const gridRef = useRef<HTMLDivElement>(null)
  const { products, loading } = usePublicProducts()

  const selectFilter = (key: FilterKey) => {
    setActive(key)
    setLimit(PAGE)
  }

  // Homepage tiles and range cards open the shop on a category
  useEffect(() => onShopFilter(selectFilter), [])

  const activeFilter = FILTERS.find((f) => f.key === active) ?? FILTERS[0]
  const filtered = useMemo(() => products.filter(activeFilter.match), [products, activeFilter])
  const shown = filtered.slice(0, limit)

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, products.filter(f.match).length])) as Record<FilterKey, number>,
    [products],
  )

  // Switching category: the whole grid dips and comes back, rather than animating every card out
  useGSAP(() => {
    if (!gridRef.current || prefersReducedMotion()) return
    gsap.fromTo(gridRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform' })
  }, { dependencies: [active] })

  // Only cards that just appeared (first load, or "Show more") animate in; each is marked once done
  useGSAP(() => {
    if (loading || !gridRef.current) return
    const fresh = gridRef.current.querySelectorAll<HTMLElement>('.pc-card:not([data-in])')
    fresh.forEach((c) => c.setAttribute('data-in', ''))
    if (fresh.length && !prefersReducedMotion()) {
      gsap.fromTo(fresh, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        stagger: Math.min(0.05, 0.6 / fresh.length),
        clearProps: 'opacity,transform',
      })
    }
    // The page got taller or shorter: re-measure the scroll animations further down
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, { dependencies: [loading, active, limit] })

  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="sec-head sec-head--split">
          <div>
            <p className="hud-label eyebrow2"><span data-scramble>Shop online // armory</span></p>
            <h2 className="display sec-title" data-glitch>Security <span className="text-armed">Products</span></h2>
          </div>
          <div data-sr="right">
            <p className="sec-sub">
              Premium security hardware from the world's leading brands, delivered across South Africa.
            </p>
            <div className="ps-result-count hud-label">
              {loading ? 'Loading…' : `Showing ${shown.length} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        <div className="ps-layout">
          <aside className="ps-sidebar">
            <div className="ps-sidebar-title">Categories</div>
            <ul className="ps-cat-list">
              {FILTERS.map((f) => (
                <li key={f.key}>
                  <button
                    className={`ps-cat-btn${active === f.key ? ' active' : ''}`}
                    onClick={() => selectFilter(f.key)}
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

          <div className="ps-main">
            <div className="ps-filter-pills">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`ps-pill${active === f.key ? ' active' : ''}`}
                  onClick={() => selectFilter(f.key)}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
                Loading products…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
                No products in this category yet.
              </div>
            ) : (
              <>
                <div className="pc-grid" ref={gridRef}>
                  {shown.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                {shown.length < filtered.length && (
                  <div className="ps-more">
                    <button type="button" className="btn2 btn2--ghost" onClick={() => setLimit((n) => n + PAGE)}>
                      Show more products
                    </button>
                    <span className="hud-label ps-more-count">{filtered.length - shown.length} more in {activeFilter.label}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
