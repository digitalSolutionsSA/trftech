/**
 * The TRF Tech mark (atom, speed bars, italic "TRF") as outline paths, traced from
 * public/logo-plain.png. The hero dome's struts and nodes fly onto these paths on scroll.
 *
 * Coordinates come out normalised: centred on the mark, y up, roughly ±1.13 wide and ±0.94 tall.
 */

type Pt = [number, number]

// Traced in the PNG's 1932px space (y down)
const CX = 978
const CY = 874
const UNIT = 700

const ellipse = (cx: number, cy: number, a: number, b: number, rot: number, n = 32): Pt[] => {
  const c = Math.cos(rot), s = Math.sin(rot)
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2
    const x = Math.cos(t) * a, y = Math.sin(t) * b
    return [cx + x * c - y * s, cy + x * s + y * c] as Pt
  })
}

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * The mark's parts in the PNG's 1932px space (y down). Shared with the boot screen, which draws
 * them as SVG — so the loading animation and the hero's wireframe trace the exact same logo.
 */
export const MARK = {
  /** Electron orbits: centre, semi-axes and tilt (radians) */
  orbits: [
    { cx: 976, cy: 478, a: 300, b: 110, rot: Math.PI / 6 },
    { cx: 976, cy: 478, a: 300, b: 110, rot: -Math.PI / 6 },
    { cx: 976, cy: 478, a: 135, b: 265, rot: -0.06 },
  ],
  nucleus: { cx: 985, cy: 475, a: 52, b: 44 },
  /** Speed bars: [x0, y0, x1, y1] */
  bars: [
    [216, 749, 579, 807],
    [1373, 749, 1736, 807],
    [424, 840, 1528, 884],
  ] as [number, number, number, number][],
  /** Italic letters; R's second outline is its counter (the hole in the bowl) */
  letters: {
    T: [[[210, 1010], [785, 1010], [762, 1125], [545, 1125], [465, 1535], [313, 1535], [393, 1125], [186, 1125]]],
    R: [
      [
        [812, 1010], [1100, 1010], [1180, 1025], [1222, 1075], [1232, 1140], [1215, 1220], [1180, 1280],
        [1128, 1325], [1205, 1535], [1040, 1535], [965, 1340], [905, 1340], [865, 1535], [710, 1535],
      ],
      [[946, 1125], [1050, 1125], [1076, 1145], [1082, 1180], [1068, 1215], [1040, 1245], [1010, 1250], [922, 1250]],
    ],
    F: [
      [
        [1328, 1010], [1770, 1010], [1747, 1125], [1465, 1125], [1445, 1228], [1675, 1228],
        [1652, 1340], [1422, 1340], [1382, 1535], [1230, 1535],
      ],
    ],
  } as Record<'T' | 'R' | 'F', Pt[][]>,
}

/** Closed outlines, each a list of corners. */
const SHAPES: Pt[][] = [
  ...MARK.orbits.map((o) => ellipse(o.cx, o.cy, o.a, o.b, o.rot)),
  ellipse(MARK.nucleus.cx, MARK.nucleus.cy, MARK.nucleus.a, MARK.nucleus.b, 0, 14),
  ...MARK.bars.map((b) => rect(...b)),
  ...Object.values(MARK.letters).flat(),
]

const norm = ([x, y]: Pt): Pt => [(x - CX) / UNIT, -(y - CY) / UNIT]

/**
 * Every straight edge of every outline. Letters and bars keep their corners exactly (each
 * edge always gets at least one segment); the orbits are fine-grained enough to resample freely.
 */
const edges = SHAPES.flatMap((raw) => {
  const s = raw.map(norm)
  return s.map((p, i) => {
    const q = s[(i + 1) % s.length]
    return { p, q, len: Math.hypot(q[0] - p[0], q[1] - p[1]) }
  })
})
const total = edges.reduce((sum, e) => sum + e.len, 0)

/** Spread `n` items over the edges in proportion to their length. */
const share = (n: number) => {
  const counts = edges.map((e) => Math.max(1, Math.round((n * e.len) / total)))
  let diff = n - counts.reduce((a, b) => a + b, 0)
  // Settle rounding on the longest edges first
  const order = edges.map((_, i) => i).sort((a, b) => edges[b].len - edges[a].len)
  for (let k = 0, guard = 0; diff !== 0 && guard < 100000; k = (k + 1) % order.length, guard++) {
    const i = order[k]
    if (diff > 0) { counts[i]++; diff-- }
    else if (counts[i] > 1) { counts[i]--; diff++ }
  }
  return counts
}

const lerp = (e: (typeof edges)[number], t: number): Pt => [e.p[0] + (e.q[0] - e.p[0]) * t, e.p[1] + (e.q[1] - e.p[1]) * t]

/** ~`n` line segments that together trace the mark: [x0, y0, x1, y1] each (always exactly `n`). */
export function logoSegments(n: number): number[][] {
  const out: number[][] = []
  share(n).forEach((count, i) => {
    for (let k = 0; k < count; k++) {
      const a = lerp(edges[i], k / count), b = lerp(edges[i], (k + 1) / count)
      out.push([a[0], a[1], b[0], b[1]])
    }
  })
  // Fewer struts than edges (never at current dome detail): double up on the last segment
  while (out.length < n) out.push(out[out.length % Math.max(1, out.length)])
  return out.slice(0, n)
}

/** `n` points spread evenly along the whole mark. */
export function logoPoints(n: number): Pt[] {
  const fine = logoSegments(Math.max(n, edges.length * 2))
  return Array.from({ length: n }, (_, i) => {
    const [x0, y0, x1, y1] = fine[Math.floor(((i + 0.5) * fine.length) / n)]
    return [(x0 + x1) / 2, (y0 + y1) / 2] as Pt
  })
}
