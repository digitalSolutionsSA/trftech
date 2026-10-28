import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, SCRAMBLE_CHARS } from '../../lib/gsap'
import { introReady, fontsReady } from '../../lib/intro'
import { scrollToId } from '../../lib/lenis'
import { SecurityDome } from '../../three/SecurityDome'

const LINES = [
  { text: 'PROTECT', cls: '' },
  { text: 'WHAT', cls: 'text-stroke' },
  { text: 'MATTERS.', cls: 'text-armed' },
]

/**
 * Hero: a Three.js shield dome assembles over the property once the boot screen lifts, while
 * the headline glitches in and the HUD decrypts. The section then pins: scrolling arms the
 * system (amber → deep orange), swoops the camera into the dome and shears the headline apart.
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const clock = useRef<HTMLSpanElement>(null)

  // Live SAST clock in the HUD
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-ZA', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Johannesburg',
    })
    const paint = () => { if (clock.current) clock.current.textContent = fmt.format(new Date()) }
    paint()
    const t = window.setInterval(paint, 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || !stage.current) return

    let dome: SecurityDome | null = null
    try {
      dome = new SecurityDome(stage.current)
    } catch {
      // No WebGL: the CSS glow and grid carry the hero on their own
      el.classList.add('hero--no-webgl')
    }

    if (prefersReducedMotion()) {
      if (dome) dome.intro = 0
      return () => dome?.dispose()
    }

    let ctx: gsap.Context | undefined
    let alive = true
    const pre = gsap.context(() => {
      gsap.set('[data-hero-fade], [data-hero-cta] > *', { opacity: 0 })
    }, el)

    Promise.all([introReady, fontsReady]).then(() => {
      if (!alive) return
      ctx = gsap.context(() => {
        const split = SplitText.create('[data-hero-word]', { type: 'chars', charsClass: 'split-char' })

        // Gradient text paints per character while split, so put the words back once they've landed
        const tl = gsap.timeline({ onComplete: () => split.revert() })
        if (dome) tl.to(dome, { intro: 0, duration: 3, ease: 'expo.out' }, 0)
        tl.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          textShadow: '-0.1em 0 0 #ff7a00, 0.1em 0 0 #fff1c2',
          duration: 1.1,
          stagger: { each: 0.035, from: 'random' },
          clearProps: 'textShadow',
        }, 0.1)
          .to('[data-hero-fade]', { opacity: 1, duration: 1, stagger: 0.1 }, 0.5)
          .fromTo('[data-hero-cta] > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.75)
          .from('[data-hero-corner]', { scale: 1.6, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.2)

        el.querySelectorAll<HTMLElement>('[data-hero-scramble]').forEach((node, i) => {
          tl.to(node, {
            duration: 1.1,
            ease: 'none',
            scrambleText: { text: node.dataset.heroScramble!, chars: SCRAMBLE_CHARS, speed: 0.6 },
          }, 0.45 + i * 0.15)
        })

        el.querySelectorAll<HTMLElement>('[data-hero-count]').forEach((node) => {
          const n = { v: 0 }
          const to = Number(node.dataset.heroCount)
          const suffix = node.dataset.suffix ?? ''
          tl.to(n, {
            v: to,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => (node.textContent = `${Math.round(n.v).toLocaleString('en-ZA')}${suffix}`),
          }, 0.9)
        })

        // Pinned scroll-away: arm the dome, shear the headline, fade the copy, then the dome's
        // wires tear loose and reassemble as the TRF mark
        const scrub = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el, start: 'top top', end: '+=140%', scrub: 0.8, pin: true, anticipatePin: 1, refreshPriority: 10,
            onUpdate: (self) => el.classList.toggle('is-armed', self.progress > 0.3),
          },
        })
        if (dome) scrub.to(dome, { progress: 1 }, 0)
        ;[-20, 16, -10].forEach((x, i) => {
          scrub.to(`[data-hero-line="${i}"]`, { xPercent: x, opacity: 0.12 }, 0)
        })
        scrub
          .to('[data-hero-overlay]', { yPercent: -16, opacity: 0, filter: 'blur(8px)' }, 0.12)
          .to('[data-hero-glow]', { scale: 1.5, opacity: 0 }, 0)
          .to('[data-hero-flash]', { opacity: 1 }, 0.72)
          .to('.hero2__headline', { opacity: 0, duration: 0.3 }, 0.5)
        if (dome) scrub.to(dome, { morph: 1, duration: 0.9, ease: 'power1.inOut' }, 0.55)
        scrub
          .fromTo('[data-hero-brand] > *',
            { opacity: 0, y: 24, letterSpacing: '0.6em' },
            { opacity: 1, y: 0, letterSpacing: (_, t: HTMLElement) => t.dataset.spacing ?? '0.2em', duration: 0.35, stagger: 0.08 },
            1.2)
          .to({}, { duration: 0.25 }) // hold on the mark before the pin releases
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }, el)
    })

    return () => {
      alive = false
      pre.revert()
      ctx?.revert()
      dome?.dispose()
    }
  }, [])

  return (
    <section ref={root} className="hero2 noise" id="hero">
      <div data-hero-glow className="hero2__glow hero2__glow--amber" />
      <div data-hero-glow className="hero2__glow hero2__glow--orange" />
      <div className="hero2__grid hud-grid" />
      <div ref={stage} className="hero2__stage" aria-hidden />
      <div className="hero2__vignette" />
      <div className="hero2__scanlines" aria-hidden />
      <div data-hero-flash className="hero2__flash" />

      {/* Viewfinder corners */}
      <span data-hero-corner className="hud-corner hud-corner--tl" aria-hidden />
      <span data-hero-corner className="hud-corner hud-corner--tr" aria-hidden />
      <span data-hero-corner className="hud-corner hud-corner--bl" aria-hidden />
      <span data-hero-corner className="hud-corner hud-corner--br" aria-hidden />

      <div className="hero2__inner container">
        <div data-hero-overlay className="hero2__top">
          <p data-hero-fade className="hud-label hero2__badge">
            <span className="rec-dot" />
            <span data-hero-scramble="CAM 01 · LIVE · Vereeniging, Gauteng">CAM 01 · LIVE · Vereeniging, Gauteng</span>
          </p>
          <div data-hero-fade className="hud-label hero2__meta">
            <span className="hero2__status">
              STATUS: <b className="hero2__status-scan">SCANNING</b><b className="hero2__status-armed">ARMED</b>
            </span>
            <span>SAST <span ref={clock}>--:--:--</span></span>
          </div>
        </div>

        <h1 className="hero2__headline display">
          {LINES.map((l, i) => (
            <span key={l.text} data-hero-line={i} className="hero2__line">
              <span className="hero2__mask">
                <span data-hero-word className={`hero2__word ${l.cls}`}>{l.text}</span>
              </span>
            </span>
          ))}
        </h1>

        <div data-hero-overlay className="hero2__bottom">
          <div className="hero2__copy">
            <p data-hero-fade className="hero2__sub">
              Gate motors, CCTV, electric fencing and AJAX alarm systems — shop online, or send
              TRF Tech an enquiry for a quote and expert advice, delivered across South Africa.
            </p>
            <div data-hero-cta className="hero2__actions">
              <a href="#products" className="btn2 btn2--primary" data-magnetic
                onClick={(e) => { e.preventDefault(); scrollToId('products') }}>
                Shop security gear
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#enquiry" className="btn2 btn2--ghost" data-magnetic
                onClick={(e) => { e.preventDefault(); scrollToId('enquiry') }}>
                Send an enquiry
              </a>
            </div>
          </div>

          <dl data-hero-fade className="hero2__stats">
            <div>
              <dt className="hud-label">Products online</dt>
              <dd className="display" data-hero-count="500" data-suffix="+">500+</dd>
            </div>
            <div>
              <dt className="hud-label">Years on watch</dt>
              <dd className="display text-armed" data-hero-count="12">12</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Revealed once the dome has reassembled as the logo */}
      <div data-hero-brand className="hero2__brand" aria-hidden>
        <p className="hero2__brand-name display" data-spacing="0.28em">TRF TECH</p>
        <p className="hero2__brand-tag hud-label" data-spacing="0.32em">Security · Construction · Gas</p>
      </div>

      <div data-hero-fade className="hero2__scroll hud-label">
        <span className="hero2__scroll-line" />
        Scroll to arm
      </div>
    </section>
  )
}
