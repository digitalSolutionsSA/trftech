import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

/** Thin amber-to-orange bar under the navbar that fills as you move down the page. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })

  return <div ref={bar} className="scroll-progress" aria-hidden />
}
