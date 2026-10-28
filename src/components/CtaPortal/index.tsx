import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { scrollToId } from '../../lib/lenis'

/**
 * A scope locking on: the section pins while a targeting reticle tightens and a circle of armed
 * orange opens from the centre until it fills the screen; the call to action rises through it.
 */
export default function CtaPortal() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=120%', scrub: 0.8, pin: true, anticipatePin: 1 },
      })
      tl.fromTo('[data-portal]', { clipPath: 'circle(5% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }, 0.15)
        .fromTo('[data-portal-ring]', { rotate: -120, scale: 1.25 }, { rotate: 60, scale: 0.55, duration: 0.35 }, 0)
        .to('[data-portal-ring]', { scale: 2.2, opacity: 0, duration: 0.5 }, 0.35)
        .fromTo('[data-portal-copy] > *', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.4 }, 0.4)
        .fromTo('[data-portal-before]', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.85, duration: 0.3 }, 0)
    },
    { scope: root },
  )

  const ring = '24/7 Technical support ◆ Certified installers ◆ Nationwide delivery ◆ '

  return (
    <section ref={root} className="portal2">
      <p data-portal-before className="portal2__before display text-stroke-dim">Exposed?</p>

      <svg data-portal-ring className="portal2__ring" viewBox="0 0 400 400" aria-hidden>
        <defs>
          <path id="portal-circle" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
        </defs>
        <circle cx="200" cy="200" r="150" className="portal2__ring-line" />
        <line x1="200" y1="20" x2="200" y2="80" className="portal2__ring-line" />
        <line x1="200" y1="320" x2="200" y2="380" className="portal2__ring-line" />
        <line x1="20" y1="200" x2="80" y2="200" className="portal2__ring-line" />
        <line x1="320" y1="200" x2="380" y2="200" className="portal2__ring-line" />
        {/* textLength = the circle's circumference, so the phrase closes the loop exactly */}
        <text textLength={1068} lengthAdjust="spacing"><textPath href="#portal-circle" textLength={1068}>{ring}</textPath></text>
      </svg>

      <div data-portal className="portal2__light">
        <div data-portal-copy className="portal2__copy">
          <p className="hud-label">Free site assessment</p>
          <h2 className="display portal2__title">Lock it<br />down.</h2>
          <div className="portal2__actions">
            <a href="#enquiry" className="btn2 portal2__btn" data-magnetic
              onClick={(e) => { e.preventDefault(); scrollToId('enquiry') }}>
              Get a free quote
            </a>
            <a href="tel:0845559862" className="btn2 portal2__btn portal2__btn--ghost" data-magnetic>
              Call 084 555 9862
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
