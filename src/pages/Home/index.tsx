import HeroSection from '../../components/HeroSection'
import ServicesSection from '../../components/ServicesSection'
import ProductsSection from '../../components/ProductsSection'
import FeaturesSection from '../../components/FeaturesSection'
import EnquirySection from '../../components/EnquirySection'
import Footer from '../../components/Footer'

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
      <div className="glow-divider" />
      <EnquirySection />
      <Footer />
    </>
  )
}
