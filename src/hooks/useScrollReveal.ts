import { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'

interface ScrollRevealOptions {
  origin?: 'top' | 'bottom' | 'left' | 'right'
  distance?: string
  duration?: number
  delay?: number
  interval?: number
  easing?: string
  reset?: boolean
}

export function useScrollReveal(
  selector: string,
  options: ScrollRevealOptions = {}
) {
  useEffect(() => {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 100,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      reset: false,
      ...options,
    })
    sr.reveal(selector, options)

    return () => {
      ;(sr as any).destroy()
    }
  }, [selector])
}
