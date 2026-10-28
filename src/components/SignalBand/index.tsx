import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'

const PRODUCTS = ['Gate Motors', 'CCTV', 'Electric Fencing', 'Alarm Systems', 'Access Control']
const PROMISE = ['Supplied', 'Installed', 'Certified', 'Monitored', 'Guaranteed']

/**
 * Two giant bands of type that slide in opposite directions as you scroll (scrubbed to position)
 * and lean into the scroll — the faster you go, the harder they skew.
 */
export default function SignalBand() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const scrub = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      gsap.fromTo("[data-band='a']", { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: scrub })
      gsap.fromTo("[data-band='b']", { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: scrub })

      const skewTo = gsap.quickTo('[data-band]', 'skewX', { duration: 0.6, ease: 'power3' })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => skewTo(gsap.utils.clamp(-14, 14, self.getVelocity() / -260)),
        onLeave: () => skewTo(0),
        onLeaveBack: () => skewTo(0),
      })
    },
    { scope: root },
  )

  const row = (words: string[], filled: boolean) =>
    [...words, ...words, ...words].map((w, i) => (
      <span key={i} className="band2__item">
        <span className={`display ${filled ? 'text-armed' : 'text-stroke'}`}>{w}</span>
        <span className={`band2__mark ${i % 2 ? 'band2__mark--amber' : ''}`}>◆</span>
      </span>
    ))

  return (
    <div ref={root} className="band2">
      <p className="sr-only">{PRODUCTS.join(' · ')}</p>
      <div data-band="a" className="band2__row" aria-hidden>{row(PRODUCTS, false)}</div>
      <div data-band="b" className="band2__row" aria-hidden>{row(PROMISE, true)}</div>
    </div>
  )
}
