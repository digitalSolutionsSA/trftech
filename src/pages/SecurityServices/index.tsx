import { useEffect } from 'react'
import Footer from '../../components/Footer'
import SecurityHero from './SecurityHero'
import OfferingsSection from './OfferingsSection'
import PackagesSection from './PackagesSection'
import ProcessSection from './ProcessSection'
import ContactSection from './ContactSection'

export default function SecurityServices() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <SecurityHero />
      <OfferingsSection />
      <PackagesSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </>
  )
}
