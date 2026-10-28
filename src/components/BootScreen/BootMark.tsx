import { gsap, SCRAMBLE_CHARS } from '../../lib/gsap'
import { MARK } from '../../three/trfLogo'

const deg = (r: number) => (r * 180) / Math.PI
const toPath = (outlines: [number, number][][]) =>
  outlines.map((pts) => `M${pts.map((p) => p.join(',')).join('L')}Z`).join('')

const ATOM = `${MARK.orbits[0].cx} ${MARK.orbits[0].cy}`
const LETTER_D = Object.values(MARK.letters).map(toPath)

/** The TRF mark as SVG, built from the same trace as the hero's wireframe logo. */
export default function BootMark() {
  return (
    <svg data-boot-mark className="boot__mark" viewBox="150 180 1680 1400" aria-hidden>
      <defs>
        <linearGradient id="boot-fill" gradientUnits="userSpaceOnUse" x1="186" y1="1010" x2="1770" y2="1535">
          <stop offset="0" stopColor="#ff7a00" />
          <stop offset="0.55" stopColor="#f39436" />
          <stop offset="1" stopColor="#ffb347" />
        </linearGradient>
        <linearGradient id="boot-shine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="boot-letters">
          {LETTER_D.map((d, i) => <path key={i} d={d} fillRule="evenodd" />)}
        </clipPath>
      </defs>

      {/* Atom: each orbit sits in a spinner group so the spin and its tilt don't fight */}
      <g className="boot__atom">
        {MARK.orbits.map((o, i) => (
          <g key={i} data-mark-spin>
            <g transform={`rotate(${deg(o.rot)} ${o.cx} ${o.cy})`}>
              <ellipse data-mark-orbit cx={o.cx} cy={o.cy} rx={o.a} ry={o.b} />
            </g>
          </g>
        ))}
        <ellipse data-mark-nucleus cx={MARK.nucleus.cx} cy={MARK.nucleus.cy} rx={MARK.nucleus.a} ry={MARK.nucleus.b} />
      </g>

      <g className="boot__bars">
        {MARK.bars.map(([x0, y0, x1, y1], i) => (
          <rect key={i} data-mark-bar={i} x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
        ))}
      </g>

      <g className="boot__letters">
        {LETTER_D.map((d, i) => <path key={i} data-mark-letter d={d} fillRule="evenodd" />)}
      </g>

      <g clipPath="url(#boot-letters)">
        <rect data-mark-shine x="-400" y="990" width="260" height="580" fill="url(#boot-shine)" transform="skewX(-12)" />
      </g>

      {/* Starts empty: decrypted in at the end of the assembly */}
      <text data-mark-tech className="boot__tech" x="1398" y="1535" />

    </svg>
  )
}

/** The assembly, ~2.6s: orbits spin in and draw, nucleus pops, bars shoot in, letters trace then fill. */
export function assembleMark() {
  const tl = gsap.timeline()
  const spins = gsap.utils.toArray<SVGGElement>('[data-mark-spin]')

  // Every tween below renders its start state immediately, so nothing shows before its cue

  // Orbits: drawn outward from a point while each spins ~a third of a turn into its tilt
  spins.forEach((g, i) => {
    tl.from(g, { rotation: i % 2 ? -140 : 140, svgOrigin: ATOM, duration: 1.3, ease: 'expo.out' }, 0.1 + i * 0.12)
      .fromTo(g.querySelector('ellipse'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'power3.inOut' }, 0.1 + i * 0.12)
  })
  const core = `${MARK.nucleus.cx} ${MARK.nucleus.cy}`
  tl.fromTo('[data-mark-nucleus]', { scale: 0, svgOrigin: core }, { scale: 1, svgOrigin: core, duration: 0.7, ease: 'back.out(3)' }, 0.75)
    .fromTo('.boot__atom', { filter: 'drop-shadow(0 0 0 rgba(255,122,0,0))' },
      { filter: 'drop-shadow(0 0 36px rgba(255,122,0,0.9))', duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.85)

  // Speed bars: the outer two shoot in from the edges, the long one stretches from the middle
  tl.from('[data-mark-bar="0"]', { x: -700, scaleX: 0.3, opacity: 0, transformOrigin: '100% 50%', duration: 0.8, ease: 'expo.out' }, 0.95)
    .from('[data-mark-bar="1"]', { x: 700, scaleX: 0.3, opacity: 0, transformOrigin: '0% 50%', duration: 0.8, ease: 'expo.out' }, 0.95)
    .from('[data-mark-bar="2"]', { scaleX: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'expo.inOut' }, 1.05)

  // Letters: slide in, trace their outline, then flood with orange
  tl.from('[data-mark-letter]', { x: 140, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, 1.15)
    .fromTo('[data-mark-letter]', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.75, stagger: 0.12, ease: 'power2.inOut' }, 1.15)
    .fromTo('[data-mark-letter]', { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, 1.7)
    .to('[data-mark-letter]', { strokeOpacity: 0, duration: 0.4 }, 2.2)

  // A light sweep across the letters, then TECH decrypts in beside the F
  tl.fromTo('[data-mark-shine]', { attr: { x: -400 } }, { attr: { x: 2100 }, duration: 0.85, ease: 'power2.inOut' }, 2.05)
    .to('[data-mark-tech]', {
      duration: 0.6, ease: 'none', scrambleText: { text: 'TECH', chars: SCRAMBLE_CHARS, speed: 1 },
    }, 2.0)

  return tl
}
