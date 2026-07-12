import { useEffect } from 'react'
import Footer from '../../components/Footer'
import GasHero from './GasHero'
import OfferingsSection from './OfferingsSection'
import SafetySection from './SafetySection'
import ProcessSection from './ProcessSection'
import QuoteSection from './QuoteSection'

export default function Gas() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <GasHero />
      <OfferingsSection />
      <SafetySection />
      <ProcessSection />
      <QuoteSection />
      <Footer />
    </>
  )
}
