import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion, SCRAMBLE_CHARS } from '../../lib/gsap'
import { markIntroDone, fontsReady } from '../../lib/intro'
import BootMark, { assembleMark } from './BootMark'

const BOOT = [
  ['scan', 'perimeter.sensors'],
  ['link', 'cctv.grid'],
  ['charge', 'fence.zones[1-4]'],
  ['arm', 'response.network'],
]

/**
 * Arming sequence: the TRF mark assembles centre stage (orbits spin in, bars shoot in, letters
 * trace and fill) while terminal lines decrypt and a counter runs to 100. "SYSTEM ARMED" flashes,
 * then a laser line crosses the middle and the screen splits open.
 */
export default function BootScreen() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(() => prefersReducedMotion())

  useGSAP(
    (_, contextSafe) => {
      if (done) {
        markIntroDone()
        return
      }
      document.documentElement.style.overflow = 'hidden'
      const progress = { v: 0 }
      const paint = () => {
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, '0')
        gsap.set('[data-boot-bar]', { scaleX: progress.v / 100 })
      }

      const intro = gsap.timeline()
      intro.from('[data-boot-head]', { opacity: 0, y: -10, duration: 0.7 }, 0)
        .add(assembleMark(), 0)
      gsap.utils.toArray<HTMLElement>('[data-boot-line]').forEach((line, i) => {
        const at = 0.3 + i * 0.5
        intro
          .set(line, { opacity: 1 }, at)
          .to(line.querySelector('[data-boot-cmd]'), {
            duration: 0.45,
            ease: 'none',
            scrambleText: { text: line.dataset.bootLine!, chars: SCRAMBLE_CHARS, speed: 1 },
          }, at)
          .fromTo(line.querySelector('[data-boot-ok]'), { opacity: 0 }, { opacity: 1, duration: 0.01 }, at + 0.42)
      })
      intro.to(progress, { v: 90, duration: 2.5, ease: 'power1.inOut', onUpdate: paint }, 0.15)

      const finish = contextSafe!(() => {
        gsap
          .timeline({
            onComplete: () => {
              document.documentElement.style.overflow = ''
              setDone(true)
              ScrollTrigger.refresh()
            },
          })
          .to(progress, { v: 100, duration: 0.35, onUpdate: paint })
          .fromTo('[data-boot-armed]', { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power4.out' })
          .to('[data-boot-armed]', { opacity: 0.2, duration: 0.06, repeat: 3, yoyo: true, ease: 'none' })
          .to('[data-boot-mark]', { scale: 1.12, duration: 0.55, ease: 'power2.in' }, '+=0.1')
          .to('[data-boot-content]', { opacity: 0, y: -24, filter: 'blur(6px)', duration: 0.45, ease: 'power2.in' }, '<')
          .fromTo('[data-boot-seam]', { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.5, ease: 'expo.inOut' }, '-=0.15')
          .add(markIntroDone)
          .to('[data-boot-top]', { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '+=0.05')
          .to('[data-boot-bottom]', { yPercent: 100, duration: 1.05, ease: 'expo.inOut' }, '<')
          .to('[data-boot-seam]', { opacity: 0, scaleY: 6, duration: 0.6 }, '<')
      })

      let alive = true
      // Fonts must be in before the hero splits its headline into characters
      Promise.all([new Promise((r) => intro.eventCallback('onComplete', r)), fontsReady]).then(
        () => alive && finish(),
      )
      return () => {
        alive = false
        document.documentElement.style.overflow = ''
      }
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="boot" aria-hidden>
      <div data-boot-top className="boot__half boot__half--top" />
      <div data-boot-bottom className="boot__half boot__half--bottom" />
      <div data-boot-seam className="boot__seam" />

      <div data-boot-content className="boot__content">
        <div className="boot__grid hud-grid" />
        <div data-boot-head className="boot__head">
          <span className="hud-label boot__muted">TRF Tech // security systems</span>
          <span className="hud-label boot__muted">TRF/SEC — v2.6</span>
        </div>

        <div className="boot__stage">
          <BootMark />
        </div>

        <div className="boot__lines">
          {BOOT.map(([verb, what]) => (
            <div key={what} data-boot-line={what} className="boot__line">
              <span className="boot__caret">&gt;</span>
              <span>{verb}</span>
              <span data-boot-cmd className="boot__cmd" />
              <span data-boot-ok className="boot__ok">[ OK ]</span>
            </div>
          ))}
        </div>

        <div className="boot__foot">
          <div className="boot__foot-row">
            <span data-boot-armed className="boot__armed">● SYSTEM ARMED</span>
            <span ref={count} className="boot__count">000</span>
          </div>
          <div className="boot__track">
            <div data-boot-bar className="boot__bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
