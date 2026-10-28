import type { ReactNode } from 'react'

/** Line icons drawn on scroll (data-draw). Kept to strokes only so DrawSVG can trace them. */
const ICONS: Record<string, ReactNode> = {
  deter: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="10" x2="8" y2="56" /><line x1="32" y1="10" x2="32" y2="56" /><line x1="56" y1="10" x2="56" y2="56" />
      <line x1="8" y1="20" x2="56" y2="20" /><line x1="8" y1="31" x2="56" y2="31" /><line x1="8" y1="42" x2="56" y2="42" />
      <polyline points="38,24 33,33 40,33 34,44" />
    </svg>
  ),
  detect: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="34" r="22" /><circle cx="32" cy="34" r="13" /><circle cx="32" cy="34" r="3" />
      <line x1="32" y1="34" x2="48" y2="18" />
      <path d="M22 8 Q32 2 42 8" />
    </svg>
  ),
  verify: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22 L44 14 L48 32 L10 40 Z" />
      <circle cx="40" cy="25" r="4" />
      <line x1="26" y1="37" x2="30" y2="52" /><line x1="18" y1="54" x2="42" y2="54" />
      <line x1="48" y1="20" x2="58" y2="18" />
    </svg>
  ),
  control: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="54" x2="58" y2="54" />
      <rect x="10" y="22" width="44" height="32" />
      <line x1="21" y1="22" x2="21" y2="54" /><line x1="32" y1="22" x2="32" y2="54" /><line x1="43" y1="22" x2="43" y2="54" />
      <path d="M10 22 L32 10 L54 22" />
      <circle cx="58" cy="38" r="3" />
    </svg>
  ),
}

const LAYERS = [
  { n: '01', key: 'deter', title: 'Deter', kit: 'Electric fencing · Palisade', text: 'Visible, energised perimeters that make intruders choose another property before they try yours.' },
  { n: '02', key: 'detect', title: 'Detect', kit: 'Alarms · PIR · Beams', text: 'Zoned alarm systems, outdoor beams and PIR sensors that know the difference between a cat and a crowbar.' },
  { n: '03', key: 'verify', title: 'Verify', kit: 'CCTV · Remote view', text: 'HD and night-vision cameras streaming to your phone, so every alert comes with eyes on the scene.' },
  { n: '04', key: 'control', title: 'Control', kit: 'Gate motors · Access', text: 'Gate automation, intercoms and biometric access — you decide exactly who gets in, and when.' },
]

/** A statement that lights up word by word as you scroll through it, then four layers of defence. */
export default function DefenceLayers() {
  return (
    <section className="layers" id="layers">
      <div className="container">
        <p className="hud-label eyebrow2">
          <span data-scramble>Threat assessment // 4 layers</span>
        </p>

        <p data-light className="layers__statement display">
          Every property has a weak point. We find it, lock it down and keep watch over it —
          with <em>four layers of defence</em> working as one system.
        </p>

        <div className="layers__grid" data-sr-children="tilt" data-sr-interval="140">
          {LAYERS.map((l) => (
            <article key={l.n} className="layer-card">
              <div className="layer-card__head">
                <span className="hud-label layer-card__num">{l.n}</span>
                <span className="hud-label layer-card__kit">{l.kit}</span>
              </div>
              <div className="layer-card__icon" data-draw>{ICONS[l.key]}</div>
              <h3 className="display layer-card__title">{l.title}</h3>
              <p className="layer-card__text">{l.text}</p>
              <span className="layer-card__scan" aria-hidden />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
