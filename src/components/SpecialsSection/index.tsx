import ProductCard from '../ProductCard'
import { usePublicProducts } from '../../hooks/useProducts'
import { isOnSpecial, openShop } from '../ProductsSection/filters'

const MAX = 8

/**
 * Specials up front, like a distributor's homepage: anything priced below its "was" price.
 * With no specials running it falls back to the products flagged as featured in the admin,
 * and with neither it stays out of the way entirely.
 */
export default function SpecialsSection() {
  const { products, loading } = usePublicProducts()

  const specials = products.filter(isOnSpecial)
  const onSpecial = specials.length > 0
  const shown = (onSpecial ? specials : products.filter((p) => p.is_featured)).slice(0, MAX)

  if (!loading && shown.length === 0) return <span id="specials" hidden />

  return (
    <section id="specials" className="specials2">
      <div className="container">
        <div className="specials2__head">
          <div>
            <p className="hud-label eyebrow2">{onSpecial ? 'Limited stock // while it lasts' : 'Hand-picked by our techs'}</p>
            <h2 className="display specials2__title">
              {onSpecial ? <>Current <span className="text-armed">Specials</span></> : <>Featured <span className="text-armed">Products</span></>}
            </h2>
          </div>
          <button type="button" className="btn2 btn2--ghost" onClick={() => openShop('all')}>
            View all products
          </button>
        </div>

        {loading ? (
          <div className="specials2__loading hud-label">Loading…</div>
        ) : (
          <div className="pc-grid specials2__grid">
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
