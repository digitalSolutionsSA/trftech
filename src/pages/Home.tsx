import HeroSection from '../components/HeroSection'
import ServicesSection from '../components/ServicesSection'
import ProductsSection from '../components/ProductsSection'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="glow-divider" />
      <ServicesSection />
      <div className="glow-divider" />
      <ProductsSection />
      <div className="glow-divider" />
      <FeaturesSection />
      <Footer />
    </>
  )
}
