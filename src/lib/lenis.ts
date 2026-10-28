import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

const raf = (time: number) => lenis?.raf(time * 1000)

/** Smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis stay in lock-step. */
export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  gsap.ticker.remove(raf)
  lenis?.destroy()
  lenis = null
}

/** Smooth-scroll to a section by id ("top" for the page top). Falls back to native scrolling. */
export function scrollToId(id: string) {
  if (id === 'top') {
    if (lenis) lenis.scrollTo(0, { force: true })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  // Land just below the fixed navbar, whose height is the --nav-h token
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
  if (lenis) lenis.scrollTo(el, { force: true, offset: -navH })
  else el.scrollIntoView({ behavior: 'smooth' })
}
