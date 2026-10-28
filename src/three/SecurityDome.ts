import * as THREE from 'three'
import { logoPoints, logoSegments } from './trfLogo'

/**
 * The hero's Three.js scene: a property under a geodesic shield.
 *
 * - A wireframe house sits in the middle of a radar floor; a sweep circles it and lights up
 *   intruder blips just outside the perimeter as it passes.
 * - An electric fence rings the property, with charge pulses running along each strand.
 * - The dome's nodes and struts share one displacement function in the shaders, so when the
 *   shield scatters (intro) or flexes (scroll) the struts stay attached to their nodes.
 * - `intro` (assemble on load) and `progress` (hero scroll) drive it: scrolling "arms" the
 *   system — scanning amber heats to armed orange — and swoops the camera down into the dome.
 */

const COLD = new THREE.Color('#ffb347')
const HOT = new THREE.Color('#ff5a00')
const SPARK = new THREE.Color('#fff1c2')
const ALERT = new THREE.Color('#ff3b3b')
const BRAND = new THREE.Color('#f39436') // the logo's orange

const LOGO_DEPTH = 6 // camera-space distance the mark settles at

const R = 1.75 // dome radius
const FENCE_R = 2.55
const FLOOR_R = 3.2

const DISPLACE = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uMorph;
  uniform float uLogoScale;
  uniform vec3 uLogoOffset;
  attribute vec3 aDir;
  attribute float aSeed;
  attribute vec2 aLogo;
  attribute float aDelay;
  varying float vMorph;
  vec3 displace(vec3 p) {
    vec3 q = p * (1.0 + 0.012 * sin(uTime * 1.4 + aSeed * 6.2831));
    q += aDir * uScatter * (1.2 + aSeed * 3.0);
    return q;
  }
  // View-space position: the dome, flying onto the TRF mark as uMorph rises. The mark lives in
  // camera space so it always faces the viewer, whatever the dome's spin or the camera's swoop.
  vec4 place(vec3 p) {
    vec4 mv = modelViewMatrix * vec4(displace(p), 1.0);
    float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.6 - aDelay * 0.6, 0.0, 1.0));
    vec4 logo = vec4(aLogo * uLogoScale + uLogoOffset.xy, uLogoOffset.z, 1.0);
    // a slight shimmer once settled so the mark feels live
    logo.xy += aDir.xy * 0.006 * sin(uTime * 2.0 + aSeed * 40.0) * m;
    vec4 pos = mix(mv, logo, m);
    pos.z += sin(m * 3.14159) * 1.4; // arc toward the camera mid-flight
    vMorph = m;
    return pos;
  }
`

const NODE_VERT = /* glsl */ `
  ${DISPLACE}
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vH;
  varying float vFade;
  void main() {
    vec4 mv = place(position);
    gl_Position = projectionMatrix * mv;
    float s = uSize * (0.6 + aSeed * 0.8);
    if (aSeed > 0.9) s *= 1.8;
    gl_PointSize = s * uPixelRatio * (6.0 / -mv.z);
    vSeed = aSeed;
    vH = position.y / ${R.toFixed(2)};
    vFade = 1.0 - clamp(uScatter * 0.3, 0.0, 0.7);
  }
`

const NODE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  uniform float uScanY;
  uniform vec3 uCold;
  uniform vec3 uHot;
  uniform vec3 uSpark;
  uniform vec3 uBrand;
  varying float vSeed;
  varying float vH;
  varying float vFade;
  varying float vMorph;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = pow(smoothstep(0.5, 0.0, d), 1.5);
    vec3 col = mix(mix(uCold, uHot, uHeat), uBrand, vMorph);
    float scan = smoothstep(0.09, 0.0, abs(vH - uScanY)) * (1.0 - vMorph);
    float blink = vSeed > 0.9 ? 0.5 + 0.5 * sin(uTime * 4.0 + vSeed * 90.0) : 0.0;
    col = mix(col, uSpark, max(scan, blink) * 0.8);
    gl_FragColor = vec4(col, core * (0.55 + 0.45 * max(scan, blink)) * vFade);
  }
`

const STRUT_VERT = /* glsl */ `
  ${DISPLACE}
  varying float vH;
  varying float vFade;
  void main() {
    gl_Position = projectionMatrix * place(position);
    vH = position.y / ${R.toFixed(2)};
    vFade = 1.0 - clamp(uScatter * 0.45, 0.0, 0.92);
  }
`

const STRUT_FRAG = /* glsl */ `
  uniform float uHeat;
  uniform float uScanY;
  uniform float uLineAlpha;
  uniform vec3 uCold;
  uniform vec3 uHot;
  uniform vec3 uSpark;
  uniform vec3 uBrand;
  varying float vH;
  varying float vFade;
  varying float vMorph;
  void main() {
    float scan = smoothstep(0.07, 0.0, abs(vH - uScanY)) * (1.0 - vMorph);
    vec3 col = mix(mix(uCold, uHot, uHeat), uSpark, scan * 0.7);
    col = mix(col, uBrand, vMorph);
    // brighter toward the crown so the dome reads as a shell, not a ball of wire
    float shell = 0.6 + 0.4 * vH;
    float alpha = mix(uLineAlpha * shell + scan * 0.6, 1.0, vMorph);
    gl_FragColor = vec4(col, alpha * vFade);
  }
`

const FLOOR_VERT = /* glsl */ `
  varying vec2 vXZ;
  void main() {
    vXZ = position.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Radar rings and spokes; the sweep brightens what it has just passed over. */
const GRID_FRAG = /* glsl */ `
  uniform float uSweep;
  uniform float uHeat;
  uniform float uReveal;
  uniform vec3 uCold;
  uniform vec3 uHot;
  varying vec2 vXZ;
  void main() {
    float a = atan(vXZ.y, vXZ.x);
    float behind = mod(uSweep - a + 12.5664, 6.2832);
    float trail = smoothstep(1.4, 0.0, behind);
    float r = length(vXZ) / ${FLOOR_R.toFixed(2)};
    float edge = smoothstep(1.0, 0.75, r);
    vec3 col = mix(uCold, uHot, uHeat);
    gl_FragColor = vec4(col, (0.08 + trail * 0.35) * edge * uReveal);
  }
`

/** The sweep itself: a fading wedge of light that trails the beam. */
const SWEEP_FRAG = /* glsl */ `
  uniform float uSweep;
  uniform float uHeat;
  uniform float uReveal;
  uniform vec3 uCold;
  uniform vec3 uHot;
  varying vec2 vXZ;
  void main() {
    float r = length(vXZ) / ${FLOOR_R.toFixed(2)};
    if (r > 1.0) discard;
    float a = atan(vXZ.y, vXZ.x);
    float behind = mod(uSweep - a + 12.5664, 6.2832);
    float wedge = pow(smoothstep(1.1, 0.0, behind), 2.2);
    float beam = smoothstep(0.035, 0.0, behind);
    vec3 col = mix(uCold, uHot, uHeat);
    float alpha = (wedge * 0.22 + beam * 0.55) * smoothstep(1.0, 0.85, r) * uReveal;
    gl_FragColor = vec4(col, alpha);
  }
`

/** Intruder blips: invisible until the sweep crosses them, then they flare and fade. */
const BLIP_VERT = /* glsl */ `
  uniform float uSweep;
  uniform float uPixelRatio;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float a = atan(position.z, position.x);
    float since = mod(uSweep - a + 12.5664, 6.2832);
    vGlow = exp(-since * 1.3);
    gl_PointSize = (14.0 + vGlow * 26.0) * uPixelRatio * (6.0 / -mv.z);
  }
`

const BLIP_FRAG = /* glsl */ `
  uniform vec3 uAlert;
  uniform float uReveal;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float ring = smoothstep(0.06, 0.0, abs(d - 0.38)) * vGlow;
    gl_FragColor = vec4(uAlert, (pow(core, 3.0) * vGlow + ring * 0.8) * uReveal);
  }
`

/** Fence strands: charge pulses race around the perimeter, one per strand. */
const FENCE_VERT = /* glsl */ `
  attribute float aT;
  attribute float aStrand;
  varying float vT;
  varying float vStrand;
  void main() {
    vT = aT;
    vStrand = aStrand;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FENCE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  uniform float uReveal;
  uniform vec3 uCold;
  uniform vec3 uHot;
  uniform vec3 uSpark;
  varying float vT;
  varying float vStrand;
  void main() {
    float head = fract(uTime * (0.16 + vStrand * 0.05) + vStrand * 0.27);
    float d = abs(vT - head);
    d = min(d, 1.0 - d);
    float pulse = smoothstep(0.05, 0.0, d);
    vec3 col = mix(mix(uCold, uHot, uHeat), uSpark, pulse);
    float base = vStrand < 0.0 ? 0.32 : 0.16; // posts are negative strands
    gl_FragColor = vec4(col, (base + pulse * 0.85 * step(0.0, vStrand)) * uReveal);
  }
`

const vec = (v: THREE.Vector3) => [v.x, v.y, v.z]

export class SecurityDome {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  private rig = new THREE.Group() // positioned by layout
  private world = new THREE.Group() // spins
  private house: THREE.LineSegments
  private houseMat: THREE.LineBasicMaterial
  private scanRing: THREE.LineLoop
  private scanMat: THREE.LineBasicMaterial
  private dust: THREE.Points
  private uniforms: Record<string, THREE.IUniform>
  private clock = new THREE.Clock()
  private frame = 0
  private running = false
  private visible = true
  private spin = 0
  private wide = true
  private mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  private observer: IntersectionObserver
  private disposables: { dispose: () => void }[] = []

  /** 1 = fully scattered (before the intro), 0 = assembled. */
  intro = 1
  /** Hero scroll progress, 0 → 1. */
  progress = 0
  /** 0 = dome, 1 = the dome's wires have reassembled as the TRF mark. */
  morph = 0

  constructor(private container: HTMLElement) {
    const small = window.innerWidth < 768

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)
    container.appendChild(this.renderer.domElement)

    this.uniforms = {
      uTime: { value: 0 },
      uScatter: { value: 1 },
      uHeat: { value: 0 },
      uScanY: { value: 0 },
      uSweep: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: small ? 4.5 : 5 },
      uPixelRatio: { value: this.renderer.getPixelRatio() },
      uLineAlpha: { value: 0.32 },
      uCold: { value: COLD },
      uHot: { value: HOT },
      uSpark: { value: SPARK },
      uAlert: { value: ALERT },
      uBrand: { value: BRAND },
      uMorph: { value: 0 },
      uLogoScale: { value: 1 },
      uLogoOffset: { value: new THREE.Vector3(0, 0, -LOGO_DEPTH) },
    }

    // Seeded random so the scene looks the same on every visit
    let seed = 11
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

    const additive = (vertexShader: string, fragmentShader: string) => {
      const m = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      this.disposables.push(m)
      return m
    }
    const geo = (attrs: Record<string, [number[], number]>) => {
      const g = new THREE.BufferGeometry()
      for (const [name, [data, size]] of Object.entries(attrs)) {
        g.setAttribute(name, new THREE.Float32BufferAttribute(data, size))
      }
      this.disposables.push(g)
      return g
    }

    /* ── Geodesic dome: unique vertices + deduped edges of the upper hemisphere ── */
    const ico = new THREE.IcosahedronGeometry(R, small ? 2 : 3)
    const p = ico.getAttribute('position')
    const key = (v: THREE.Vector3) => `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`
    const nodeIndex = new Map<string, number>()
    const nodes: THREE.Vector3[] = []
    const indexOf = (v: THREE.Vector3) => {
      const k = key(v)
      if (!nodeIndex.has(k)) {
        nodeIndex.set(k, nodes.length)
        nodes.push(v.clone())
      }
      return nodeIndex.get(k)!
    }
    const edges = new Set<string>()
    const edgeList: [number, number][] = []
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
    for (let i = 0; i < p.count; i += 3) {
      a.fromBufferAttribute(p, i)
      b.fromBufferAttribute(p, i + 1)
      c.fromBufferAttribute(p, i + 2)
      if (a.y < -0.01 || b.y < -0.01 || c.y < -0.01) continue
      const tri = [indexOf(a), indexOf(b), indexOf(c)]
      for (let e = 0; e < 3; e++) {
        const i0 = Math.min(tri[e], tri[(e + 1) % 3])
        const i1 = Math.max(tri[e], tri[(e + 1) % 3])
        const k = `${i0}-${i1}`
        if (!edges.has(k)) {
          edges.add(k)
          edgeList.push([i0, i1])
        }
      }
    }
    ico.dispose()

    const dirs = nodes.map((n) =>
      n.clone().normalize().add(new THREE.Vector3(rand() - 0.5, rand() * 0.5, rand() - 0.5)).normalize(),
    )
    const seeds = nodes.map(() => rand())

    /* ── Logo targets: the crown flies to the atom, the base to the letters ── */
    const byHeight = (ys: number[]) => ys.map((_, i) => i).sort((i, j) => ys[j] - ys[i])
    // Fill the mark left to right, with a little scatter
    const delayAt = (x: number) => Math.min(1, Math.max(0, (x + 1.15) / 2.3)) * 0.7 + rand() * 0.3

    const pts = logoPoints(nodes.length)
    const nodeLogo: number[][] = new Array(nodes.length)
    const ptOrder = byHeight(pts.map((q) => q[1]))
    byHeight(nodes.map((n) => n.y)).forEach((ni, k) => (nodeLogo[ni] = pts[ptOrder[k]]))

    const segs = logoSegments(edgeList.length)
    const segOrder = byHeight(segs.map((s) => s[1] + s[3]))
    const strutOrder = byHeight(edgeList.map(([i0, i1]) => nodes[i0].y + nodes[i1].y))
    const strutLogo: number[][] = new Array(edgeList.length)
    strutOrder.forEach((ei, k) => (strutLogo[ei] = segs[segOrder[k]]))

    const nodePoints = new THREE.Points(
      geo({
        position: [nodes.flatMap(vec), 3],
        aDir: [dirs.flatMap(vec), 3],
        aSeed: [seeds, 1],
        aLogo: [nodeLogo.flat(), 2],
        aDelay: [nodeLogo.map((q) => delayAt(q[0])), 1],
      }),
      additive(NODE_VERT, NODE_FRAG),
    )

    const sPos: number[] = [], sDir: number[] = [], sSeed: number[] = [], sLogo: number[] = [], sDelay: number[] = []
    edgeList.forEach(([i0, i1], e) => {
      const [x0, y0, x1, y1] = strutLogo[e]
      const d = delayAt((x0 + x1) / 2)
      for (const i of [i0, i1]) {
        sPos.push(...vec(nodes[i]))
        sDir.push(...vec(dirs[i]))
        sSeed.push(seeds[i])
        sDelay.push(d) // both ends travel together so the strut never stretches
      }
      sLogo.push(x0, y0, x1, y1)
    })
    const struts = new THREE.LineSegments(
      geo({ position: [sPos, 3], aDir: [sDir, 3], aSeed: [sSeed, 1], aLogo: [sLogo, 2], aDelay: [sDelay, 1] }),
      additive(STRUT_VERT, STRUT_FRAG),
    )
    // The mark is placed in camera space, outside the dome's bounds
    nodePoints.frustumCulled = struts.frustumCulled = false
    this.world.add(nodePoints, struts)

    /* ── Scan ring that climbs the dome ── */
    const ringPts: number[] = []
    for (let i = 0; i < 96; i++) {
      const t = (i / 96) * Math.PI * 2
      ringPts.push(Math.cos(t), 0, Math.sin(t))
    }
    this.scanMat = new THREE.LineBasicMaterial({
      color: SPARK, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    this.scanRing = new THREE.LineLoop(geo({ position: [ringPts, 3] }), this.scanMat)
    this.disposables.push(this.scanMat)
    this.world.add(this.scanRing)

    /* ── Radar floor: rings + spokes, and the sweep wedge ── */
    const grid: number[] = []
    for (const r of [0.8, 1.6, 2.4, 3.2]) {
      const n = 120
      for (let i = 0; i < n; i++) {
        const t0 = (i / n) * Math.PI * 2, t1 = ((i + 1) / n) * Math.PI * 2
        grid.push(Math.cos(t0) * r, 0, Math.sin(t0) * r, Math.cos(t1) * r, 0, Math.sin(t1) * r)
      }
    }
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * Math.PI * 2
      grid.push(Math.cos(t) * 0.3, 0, Math.sin(t) * 0.3, Math.cos(t) * FLOOR_R, 0, Math.sin(t) * FLOOR_R)
    }
    this.world.add(new THREE.LineSegments(geo({ position: [grid, 3] }), additive(FLOOR_VERT, GRID_FRAG)))

    const disc = new THREE.CircleGeometry(FLOOR_R, 96)
    disc.rotateX(-Math.PI / 2)
    this.disposables.push(disc)
    const sweep = new THREE.Mesh(disc, additive(FLOOR_VERT, SWEEP_FRAG))
    sweep.position.y = -0.002
    this.world.add(sweep)

    /* ── Intruder blips just outside the fence ── */
    const blips: number[] = []
    for (let i = 0; i < 7; i++) {
      const t = rand() * Math.PI * 2
      const r = FENCE_R + 0.2 + rand() * 0.45
      blips.push(Math.cos(t) * r, 0.02, Math.sin(t) * r)
    }
    this.world.add(new THREE.Points(geo({ position: [blips, 3] }), additive(BLIP_VERT, BLIP_FRAG)))

    /* ── Electric fence: posts + strands ── */
    const POSTS = 32
    const STRANDS = [0.12, 0.24, 0.36, 0.48]
    const fPos: number[] = [], fT: number[] = [], fStrand: number[] = []
    for (let i = 0; i < POSTS; i++) {
      const t = (i / POSTS) * Math.PI * 2
      const x = Math.cos(t) * FENCE_R, z = Math.sin(t) * FENCE_R
      fPos.push(x, 0, z, x, 0.56, z)
      fT.push(0, 0)
      fStrand.push(-1, -1)
    }
    STRANDS.forEach((h, s) => {
      for (let i = 0; i < POSTS; i++) {
        const t0 = (i / POSTS) * Math.PI * 2, t1 = ((i + 1) / POSTS) * Math.PI * 2
        fPos.push(Math.cos(t0) * FENCE_R, h, Math.sin(t0) * FENCE_R, Math.cos(t1) * FENCE_R, h, Math.sin(t1) * FENCE_R)
        fT.push(i / POSTS, (i + 1) / POSTS)
        fStrand.push(s, s)
      }
    })
    this.world.add(
      new THREE.LineSegments(
        geo({ position: [fPos, 3], aT: [fT, 1], aStrand: [fStrand, 1] }),
        additive(FENCE_VERT, FENCE_FRAG),
      ),
    )

    /* ── The property: a wireframe house with a gate post ── */
    const body = new THREE.BoxGeometry(0.8, 0.46, 0.6)
    body.translate(0, 0.23, 0)
    const roof = new THREE.ConeGeometry(0.62, 0.34, 4, 1, true)
    roof.rotateY(Math.PI / 4)
    roof.scale(1, 1, 0.78)
    roof.translate(0, 0.63, 0)
    const bodyEdges = new THREE.EdgesGeometry(body)
    const roofEdges = new THREE.EdgesGeometry(roof)
    const door = [-0.08, 0, 0.301, -0.08, 0.22, 0.301, -0.08, 0.22, 0.301, 0.08, 0.22, 0.301, 0.08, 0.22, 0.301, 0.08, 0, 0.301]
    const merged = [
      ...Array.from(bodyEdges.getAttribute('position').array),
      ...Array.from(roofEdges.getAttribute('position').array),
      ...door,
    ]
    ;[body, roof, bodyEdges, roofEdges].forEach((g) => g.dispose())
    this.houseMat = new THREE.LineBasicMaterial({
      color: COLD.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    this.disposables.push(this.houseMat)
    this.house = new THREE.LineSegments(geo({ position: [merged, 3] }), this.houseMat)
    this.world.add(this.house)

    this.rig.add(this.world)
    this.scene.add(this.rig)

    /* ── Background dust for depth ── */
    const dPos: number[] = []
    for (let i = 0; i < (small ? 260 : 600); i++) {
      dPos.push((rand() - 0.5) * 18, (rand() - 0.2) * 9, (rand() - 0.5) * 12 - 3)
    }
    const dMat = new THREE.PointsMaterial({
      color: '#ffd08a', size: 0.02, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    this.disposables.push(dMat)
    this.dust = new THREE.Points(geo({ position: [dPos, 3] }), dMat)
    this.scene.add(this.dust)

    this.disposables.push(this.renderer)

    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.onPointer)
    document.addEventListener('visibilitychange', this.onVisibility)

    // Only render while the hero is on screen
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      this.visible ? this.start() : this.stop()
    })
    this.observer.observe(container)
    this.start()
  }

  private resize = () => {
    const { clientWidth: w, clientHeight: h } = this.container
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    // Wide screens: the dome sits right of the headline. Portrait (phones): it's lifted into the
    // open space above the headline and shrunk, so its wires frame the copy instead of crossing it.
    const aspect = w / h
    this.wide = aspect > 1.15
    const portrait = aspect < 0.8
    this.rig.position.set(this.wide ? 2.1 : 0, this.wide ? -0.55 : portrait ? 2.05 : 0.5, 0)
    this.rig.scale.setScalar(this.wide ? 1 : portrait ? 0.5 : 0.75)
    // Size the mark to the frame: ~45% of the height, never wider than ~80% of the width
    const halfH = LOGO_DEPTH * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const scale = Math.min(halfH * 0.46, (halfH * this.camera.aspect * 0.8) / 1.13)
    this.uniforms.uLogoScale.value = scale
    this.uniforms.uLogoOffset.value.y = halfH * 0.12
  }

  private onPointer = (e: PointerEvent) => {
    this.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  private onVisibility = () => (document.hidden ? this.stop() : this.visible && this.start())

  private start() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    this.frame = requestAnimationFrame(this.tick)
  }

  private stop() {
    this.running = false
    cancelAnimationFrame(this.frame)
  }

  private tick = () => {
    if (!this.running) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const p = this.progress
    const u = this.uniforms
    // The property, fence and radar fade away as the wires leave to form the mark
    const reveal = (1 - this.intro) * (1 - Math.min(1, this.morph * 1.8))

    u.uTime.value += dt
    u.uMorph.value = this.morph
    u.uScatter.value = this.intro * 2.4 + Math.sin(p * Math.PI) * 0.18 * (1 - this.morph)
    u.uHeat.value = Math.min(1, p * 1.6)
    u.uReveal.value = reveal
    u.uSweep.value = (u.uSweep.value + dt * (1.5 + p * 3)) % (Math.PI * 2)
    u.uScanY.value = (u.uTime.value * (0.32 + p * 0.6)) % 1.15

    // Scan ring rides the same height as the shader scan band
    const sy = Math.min(u.uScanY.value, 1)
    this.scanRing.position.y = sy * R
    this.scanRing.scale.setScalar(Math.max(0.001, Math.sqrt(1 - sy * sy) * R))
    this.scanMat.opacity = (u.uScanY.value < 1 ? 0.55 : 0) * reveal
    this.scanMat.color.copy(COLD).lerp(HOT, u.uHeat.value).lerp(SPARK, 0.4)

    this.houseMat.opacity = 0.85 * reveal
    this.houseMat.color.copy(COLD).lerp(HOT, u.uHeat.value)
    this.house.scale.setScalar(0.6 + reveal * 0.4)

    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05
    this.spin += dt * (0.08 + p * 0.5)
    this.world.rotation.y = this.spin + this.mouse.x * 0.35
    this.dust.rotation.y = this.spin * 0.12
    this.dust.position.x = -this.mouse.x * 0.3

    // Scrolling away swoops the camera from a high watch position down into the dome. On narrow
    // screens the dome is lifted above the headline, so the swoop rises with it as it goes in.
    const lift = this.wide ? 0 : (this.rig.position.y - 0.1) * p
    const dist = (this.wide ? 7.4 : 9.2) - p * 3.6
    const height = 2.6 - p * 1.9 + lift + this.mouse.y * 0.35
    this.camera.position.set(this.rig.position.x * p * 0.9, height, dist)
    this.camera.lookAt(this.rig.position.x * (0.25 + p * 0.75), 0.55 - p * 0.1 + lift, 0)

    this.renderer.render(this.scene, this.camera)
    this.frame = requestAnimationFrame(this.tick)
  }

  dispose() {
    this.stop()
    this.observer.disconnect()
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.onPointer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.disposables.forEach((d) => d.dispose())
    this.renderer.domElement.remove()
  }
}
