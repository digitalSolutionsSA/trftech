import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  className?: string
  accentColor?: number
}

export default function ThreeScene({ className = 'hero-canvas', accentColor = 0xff7a00 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ── Renderer ─────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(canvas.parentElement!.clientWidth, canvas.parentElement!.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    /* ── Scene & Camera ───────────────────────────── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, canvas.parentElement!.clientWidth / canvas.parentElement!.clientHeight, 0.1, 1000)
    camera.position.z = 18

    /* ── Primary particles ────────────────────────── */
    const COUNT   = 130
    const posArr  = new Float32Array(COUNT * 3)
    const velArr  = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.016,
      y: (Math.random() - 0.5) * 0.011,
    }))

    for (let i = 0; i < COUNT; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 44
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 28
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    const pMat  = new THREE.PointsMaterial({ color: accentColor, size: 0.18, transparent: true, opacity: 0.75, sizeAttenuation: true })
    const pMesh = new THREE.Points(pGeo, pMat)
    scene.add(pMesh)

    /* ── Accent particles ─────────────────────────── */
    const COUNT2  = 50
    const posArr2 = new Float32Array(COUNT2 * 3)
    for (let i = 0; i < COUNT2; i++) {
      posArr2[i * 3]     = (Math.random() - 0.5) * 44
      posArr2[i * 3 + 1] = (Math.random() - 0.5) * 28
      posArr2[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    const pGeo2 = new THREE.BufferGeometry()
    pGeo2.setAttribute('position', new THREE.BufferAttribute(posArr2, 3))
    scene.add(new THREE.Points(pGeo2, new THREE.PointsMaterial({ color: 0x7b2fff, size: 0.11, transparent: true, opacity: 0.45 })))

    /* ── Connecting lines ─────────────────────────── */
    const MAX_LINES  = 400
    const linePos    = new Float32Array(MAX_LINES * 6)
    const lineGeo    = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    lineGeo.setDrawRange(0, 0)
    const lineMesh = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.16 }))
    scene.add(lineMesh)

    /* ── Mouse parallax ───────────────────────────── */
    let mouseX = 0, mouseY = 0
    let targetX = 0, targetY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── Resize handler ───────────────────────────── */
    const onResize = () => {
      const w = canvas.parentElement!.clientWidth
      const h = canvas.parentElement!.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ── Animate ──────────────────────────────────── */
    const THRESHOLD = 7.5
    let frameCount  = 0
    let animId      = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      frameCount++

      targetX += (mouseX - targetX) * 0.03
      targetY += (mouseY - targetY) * 0.03
      camera.position.x =  targetX * 1.5
      camera.position.y = -targetY * 1.0

      // Move particles
      for (let i = 0; i < COUNT; i++) {
        posArr[i * 3]     += velArr[i].x
        posArr[i * 3 + 1] += velArr[i].y
        if (posArr[i * 3]     >  22) posArr[i * 3]     = -22
        if (posArr[i * 3]     < -22) posArr[i * 3]     =  22
        if (posArr[i * 3 + 1] >  14) posArr[i * 3 + 1] = -14
        if (posArr[i * 3 + 1] < -14) posArr[i * 3 + 1] =  14
      }
      pGeo.attributes.position.needsUpdate = true

      // Update lines every 2 frames
      if (frameCount % 2 === 0) {
        let lineIdx = 0
        for (let i = 0; i < COUNT && lineIdx < MAX_LINES; i++) {
          for (let j = i + 1; j < COUNT && lineIdx < MAX_LINES; j++) {
            const dx   = posArr[i * 3] - posArr[j * 3]
            const dy   = posArr[i * 3 + 1] - posArr[j * 3 + 1]
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < THRESHOLD) {
              linePos[lineIdx * 6]     = posArr[i * 3];     linePos[lineIdx * 6 + 1] = posArr[i * 3 + 1]; linePos[lineIdx * 6 + 2] = posArr[i * 3 + 2]
              linePos[lineIdx * 6 + 3] = posArr[j * 3];     linePos[lineIdx * 6 + 4] = posArr[j * 3 + 1]; linePos[lineIdx * 6 + 5] = posArr[j * 3 + 2]
              lineIdx++
            }
          }
        }
        lineGeo.setDrawRange(0, lineIdx * 2)
        lineGeo.attributes.position.needsUpdate = true
      }

      pMesh.rotation.z += 0.0003
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      pGeo.dispose(); pMat.dispose()
      lineGeo.dispose()
    }
  }, [accentColor])

  return <canvas ref={canvasRef} className={className} />
}
