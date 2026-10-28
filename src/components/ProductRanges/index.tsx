import { openShop, type FilterKey } from '../ProductsSection/filters'

const RANGES: {
  key: FilterKey; name: string; desc: string; img: string
  /** Shown if `img` fails to load, so a missing file never leaves a broken image */
  fallback?: string
  pos?: string; feature?: boolean; product?: boolean
}[] = [
  {
    key: 'ajax',
    name: 'AJAX',
    desc: 'Wireless alarm systems, sensors and sirens — armed, monitored and controlled from your phone.',
    img: '/ranges/ajax-kit.jpg',
    feature: true,
    // A product shot on white: shown whole on a white panel rather than darkened as a backdrop
    product: true,
  },
  {
    key: 'cameras',
    name: 'CCTV',
    desc: 'HD and IP cameras, NVRs and remote viewing.',
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80&auto=format&fit=crop',
  },
  {
    key: 'gate-motors',
    name: 'Gate Motors',
    desc: 'Sliding and swing motors, remotes and batteries.',
    img: '/ranges/gate-motor.jpg',
    fallback: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=800&q=80&auto=format&fit=crop',
    pos: '70% 60%', // keep the motor in frame when the card crops the photo
  },
  {
    key: 'electric-fencing',
    name: 'Electric Fencing',
    desc: 'Energizers, wire, insulators and accessories.',
    img: 'https://images.unsplash.com/photo-1549109926-9620d1b9bfa2?w=800&q=80&auto=format&fit=crop',
  },
]

/** "Explore our featured ranges": big image cards that open the shop on that range. */
export default function ProductRanges() {
  return (
    <section className="ranges2" aria-labelledby="ranges2-title">
      <div className="container">
        <p className="hud-label eyebrow2">Shop by range</p>
        <h2 id="ranges2-title" className="display ranges2__title">
          Featured <span className="text-armed">Ranges</span>
        </h2>

        <div className="ranges2__grid">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`range2${r.feature ? ' range2--feature' : ''}${r.product ? ' range2--product' : ''}`}
              onClick={() => openShop(r.key)}
            >
              <img
                src={r.img} alt="" className="range2__img" loading="lazy"
                style={r.pos ? { objectPosition: r.pos } : undefined}
                onError={(e) => {
                  const img = e.currentTarget
                  if (r.fallback && img.src !== r.fallback) {
                    img.src = r.fallback
                    img.style.objectPosition = '' // the framing was for the intended photo
                  }
                }}
              />
              <span className="range2__tint" />
              <span className="range2__body">
                {r.feature && <span className="range2__badge hud-label">New range</span>}
                <span className="display range2__name">{r.name}</span>
                <span className="range2__desc">{r.desc}</span>
                <span className="range2__cta hud-label">Shop {r.name} <span aria-hidden>→</span></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
