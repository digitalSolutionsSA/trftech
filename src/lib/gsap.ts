// Single place where GSAP plugins are registered. Import gsap from here, not from 'gsap'.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase, useGSAP)

// Hard snap, then a long settle — like a bolt sliding home. The house ease for reveals.
CustomEase.create('lock', 'M0,0 C0.14,0.7 0.2,0.96 0.38,1 0.6,1.02 0.8,1 1,1')

gsap.defaults({ ease: 'lock', duration: 1 })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Glyphs ScrambleText cycles through — reads as a terminal decrypting a feed. */
export const SCRAMBLE_CHARS = '01<>/\\[]#%&=+*ABCDEFHKLMNPRSTVXZ'

export { gsap, ScrollTrigger, SplitText, useGSAP }
