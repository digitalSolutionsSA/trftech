import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToId } from '../../lib/lenis'
import { openShop } from '../ProductsSection/filters'

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
)

type Tile = { label: string; sub: string; icon: ReactNode } & ({ to: string } | { run: () => void })

const TILES: Tile[] = [
  {
    label: 'Shop products', sub: 'Full catalogue',
    icon: icon(<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>),
    run: () => openShop('all'),
  },
  {
    label: 'Specials', sub: 'Deals this month',
    icon: icon(<><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" /><circle cx="7" cy="7" r="1.5" /></>),
    run: () => scrollToId('specials'),
  },
  {
    label: 'AJAX range', sub: 'Wireless alarms',
    icon: icon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
    run: () => openShop('ajax'),
  },
  {
    label: 'Enquire', sub: 'Quotes & advice',
    icon: icon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
    run: () => scrollToId('enquiry'),
  },
  {
    label: 'Construction', sub: 'Build & renovate',
    icon: icon(<><path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><path d="M9 20v-6h6v6" /></>),
    to: '/construction',
  },
  {
    label: 'Gas', sub: 'Supply & installs',
    icon: icon(<path d="M12 2s6 6 6 11a6 6 0 0 1-12 0c0-2 1-4 2-5 0 2 1 3 2 3 0-4 2-6 2-9z" />),
    to: '/gas',
  },
]

/** Regal-style landing strip: one line of welcome, then straight into shortcuts to shop and enquire. */
export default function HomeIntro() {
  const navigate = useNavigate()

  return (
    <section className="intro2" aria-labelledby="intro2-title">
      <div className="container">
        <div className="intro2__head">
          <h2 id="intro2-title" className="display intro2__title">
            Welcome to <span className="text-armed">TRF Tech</span>
          </h2>
          <p className="intro2__sub">
            Gate motors, CCTV, alarms and electric fencing from the brands installers trust — shop online, or
            send us an enquiry for a quote and advice on the right gear, delivered across South Africa.
          </p>
        </div>

        <ul className="intro2__tiles" data-sr-children="rise" data-sr-interval="60">
          {TILES.map((t) => (
            <li key={t.label}>
              <button
                type="button"
                className="intro2__tile"
                onClick={() => ('to' in t ? navigate(t.to) : t.run())}
              >
                <span className="intro2__icon">{t.icon}</span>
                <span className="intro2__label">{t.label}</span>
                <span className="intro2__tsub hud-label">{t.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
