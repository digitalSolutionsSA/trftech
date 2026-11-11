import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../../components/Footer'
import TrfScienceHero from './TrfScienceHero'
import OfferingsSection from './OfferingsSection'
import ProcessSection from './ProcessSection'
import QuoteSection from './QuoteSection'

export default function TrfScience() {
  const { hash } = useLocation()

  useEffect(() => {
    // Links like /trf-science#chemicals jump straight to that range
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300)
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      <TrfScienceHero />
      <OfferingsSection />
      <ProcessSection />
      <QuoteSection />
      <Footer />
    </>
  )
}
