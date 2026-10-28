import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

/**
 * Targeting cursor: a tight orange dot and a lagging crosshair reticle that locks on
 * (closes its brackets and turns orange) over links and buttons.
 * Elements marked data-magnetic lean toward the pointer.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.body.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    let magnet: HTMLElement | null = null
    let shown = false
    gsap.set([dot.current, ring.current], { opacity: 0 })

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.4 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)

      const target = e.target as HTMLElement
      const hot = target.closest('a, button, select, input, textarea, label, [data-cursor]')
      ring.current?.classList.toggle('is-locked', !!hot)

      const m = target.closest<HTMLElement>('[data-magnetic]')
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
        magnet = m
      }
      if (m) {
        const r = m.getBoundingClientRect()
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
          duration: 0.4,
          ease: 'power3',
        })
      }
    }

    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-reticle" aria-hidden>
        <span /><span /><span /><span />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}
