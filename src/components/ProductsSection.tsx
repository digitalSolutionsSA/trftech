import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from 'scrollreveal'
import ProductCard from './ProductCard'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'

gsap.registerPlugin(ScrollTrigger)

type FilterKey = 'all' | Product['category']

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',              label: 'All Products' },
  { key: 'gate-motors',      label: '🚪 Gate Motors' },
  { key: 'cameras',          label: '📷 Cameras' },
  { key: 'electric-fencing', label: '⚡ Electric Fencing' },
  { key: 'alarm-systems',    label: '🔔 Alarm Systems' },
]

export default function ProductsSection() {
  const [active, setActive] = useState<FilterKey>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)

  const handleFilter = (key: FilterKey) => {
    if (!gridRef.current) { setActive(key); return }
    gsap.to(gridRef.current.querySelectorAll('.product-card'), {
      opacity: 0, y: 10, duration: 0.18, stagger: 0.03,
      onComplete: () => {
        setActive(key)
        requestAnimationFrame(() => {
          gsap.from(gridRef.current!.querySelectorAll('.product-card'), {
            opacity: 0, y: 22, duration: 0.38, stagger: 0.05, ease: 'power2.out',
          })
        })
      },
    })
  }

  useEffect(() => {
    const sr = ScrollReveal({ reset: false })
    sr.reveal('.products-section .section-header', { origin: 'top', distance: '30px', duration: 700 })
    return () => (sr as any).destroy()
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const sr = ScrollReveal({ reset: false })
    sr.reveal('.product-card', { origin: 'bottom', distance: '30px', duration: 700, interval: 70, delay: 80 })
    return () => (sr as any).destroy()
  }, [active])

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Shop Online</div>
          <h2 className="section-title">Security <span>Products</span></h2>
          <p className="section-desc">
            Premium security hardware from the world's leading brands — delivered to your door across South Africa.
          </p>
        </div>

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn${active === f.key ? ' active' : ''}`}
              onClick={() => handleFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="products-grid" ref={gridRef}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
