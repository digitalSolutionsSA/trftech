import { useEffect } from 'react'
import Footer from '../../components/Footer'
import ConstructionHero from './ConstructionHero'
import OfferingsSection from './OfferingsSection'
import ProcessSection from './ProcessSection'
import QuoteSection from './QuoteSection'

export default function Construction() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <ConstructionHero />
      <OfferingsSection />
      <ProcessSection />
      <QuoteSection />
      <Footer />
    </>
  )
}
