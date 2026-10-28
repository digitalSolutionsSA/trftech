import { useEffect, useRef } from 'react'
import BootScreen from '../../components/BootScreen'
import Cursor from '../../components/Cursor'
import ScrollProgress from '../../components/ScrollProgress'
import HeroSection from '../../components/HeroSection'
import HomeIntro from '../../components/HomeIntro'
import SpecialsSection from '../../components/SpecialsSection'
import ProductRanges from '../../components/ProductRanges'
import ProductsSection from '../../components/ProductsSection'
import FeaturesSection from '../../components/FeaturesSection'
import EnquirySection from '../../components/EnquirySection'
import Footer from '../../components/Footer'
import { initLenis, destroyLenis } from '../../lib/lenis'
import { introReady } from '../../lib/intro'
import { prefersReducedMotion } from '../../lib/gsap'
import { useSignalReveal } from '../../hooks/useSignalReveal'
import { useScrollRevealPresets } from '../../hooks/useScrollRevealPresets'

export default function Home() {
  const page = useRef<HTMLDivElement>(null)
  useSignalReveal(page)
  useScrollRevealPresets()

  // Smooth scroll is held while the boot screen runs, then released with the curtain
  useEffect(() => {
    let alive = true
    const lenis = prefersReducedMotion() ? null : initLenis()
    lenis?.stop()
    introReady.then(() => alive && lenis?.start())
    return () => {
      alive = false
      destroyLenis()
    }
  }, [])

  return (
    <div ref={page} className="home">
      <BootScreen />
      <Cursor />
      <ScrollProgress />
      {/* Kept short on purpose: hero, a line of welcome, then straight into specials and the shop.
          Services detail lives on /security-services rather than on the homepage. */}
      <main>
        <HeroSection />
        <HomeIntro />
        <SpecialsSection />
        <ProductRanges />
        <ProductsSection />
        <FeaturesSection />
        <EnquirySection />
      </main>
      <Footer />
    </div>
  )
}
