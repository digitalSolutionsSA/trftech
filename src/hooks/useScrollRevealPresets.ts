import { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import { gsap, prefersReducedMotion, ScrollTrigger, SCRAMBLE_CHARS } from '../lib/gsap'

type SROptions = scrollReveal.ScrollRevealObjectOptions

const base: SROptions = {
  distance: '60px',
  duration: 1100,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  opacity: 0,
  viewFactor: 0.15,
  cleanup: true,
}

const presets: Record<string, SROptions> = {
  rise: { origin: 'bottom' },
  drop: { origin: 'top' },
  left: { origin: 'left', distance: '90px' },
  right: { origin: 'right', distance: '90px' },
  // tips up toward the viewer like a panel being stood on its edge
  tilt: { origin: 'bottom', distance: '40px', rotate: { x: 40, y: 0, z: 0 } },
  // springs in from small, like a camera locking focus
  pop: { distance: '0px', scale: 0.7, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: 900 },
  swing: { origin: 'left', distance: '40px', rotate: { x: 0, y: 0, z: -6 } },
  fade: { distance: '0px', duration: 1500 },
}

/** Decrypt any [data-sr-scramble] text inside an element ScrollReveal is about to show. */
const scrambleInside = (el: HTMLElement) => {
  el.querySelectorAll<HTMLElement>('[data-sr-scramble]').forEach((node) => {
    const text = node.textContent || ''
    gsap.to(node, {
      duration: 1,
      ease: 'none',
      delay: 0.15,
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.7, revealDelay: 0.2 },
    })
  })
}

/**
 * ScrollReveal wired to markup:
 *   data-sr="rise|drop|left|right|tilt|pop|swing|fade"   reveal one element (data-sr-delay="150" to wait)
 *   data-sr-children="rise|…"                           reveal each direct child in sequence (data-sr-interval="120")
 * Text marked data-sr-scramble inside a revealed element decrypts as it appears (GSAP ScrambleText).
 */
export function useScrollRevealPresets() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const sr = ScrollReveal()
    const done = new WeakSet<Element>()
    const hooks: SROptions = { beforeReveal: (el) => scrambleInside(el as HTMLElement) }

    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-sr]').forEach((el) => {
        if (done.has(el)) return
        done.add(el)
        const preset = presets[el.dataset.sr ?? 'rise'] ?? presets.rise
        sr.reveal(el, { ...base, ...preset, ...hooks, delay: Number(el.dataset.srDelay ?? 0) })
      })
      document.querySelectorAll<HTMLElement>('[data-sr-children]').forEach((el) => {
        if (done.has(el)) return
        done.add(el)
        const preset = presets[el.dataset.srChildren || 'rise'] ?? presets.rise
        const kids = el.querySelectorAll(':scope > *')
        sr.reveal(kids, { ...base, ...preset, ...hooks, interval: Number(el.dataset.srInterval ?? 110) })
      })
    }

    // ScrollReveal measures positions once and only re-measures on resize. Pinned GSAP scenes
    // move everything below them, so re-measure whenever ScrollTrigger refreshes.
    const remeasure = () =>
      (sr as unknown as { delegate?: (e: { type: string }) => void }).delegate?.({ type: 'resize' })

    scan()
    const timers = [300, 900, 2000].map((ms) =>
      window.setTimeout(() => {
        scan()
        remeasure()
      }, ms),
    )
    ScrollTrigger.addEventListener('refresh', remeasure)
    return () => {
      timers.forEach(clearTimeout)
      ScrollTrigger.removeEventListener('refresh', remeasure)
    }
  }, [])
}
