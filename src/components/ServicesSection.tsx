import { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import ServiceCard from './ServiceCard'
import type { ServiceCardData } from '../types'

const SERVICES: ServiceCardData[] = [
  {
    id: 'construction',
    title: 'Construction',
    icon: '🏗️',
    desc: 'From boundary walls and palisade fencing to full commercial builds — our certified construction team handles structures of any scale with precision craftsmanship.',
    color: '#ff7a00',
    iconBg: 'rgba(255,122,0,0.10)',
    glow: 'rgba(255,122,0,0.3)',
    features: ['Boundary Walls', 'Palisade Fencing', 'Carports', 'Site Setup'],
    href: '/construction',
  },
  {
    id: 'security',
    title: 'Security Services',
    icon: '🛡️',
    desc: 'Professional installation, commissioning and maintenance of all security systems — alarms, CCTV, access control, and electric fencing by certified technicians.',
    color: '#ff7a00',
    iconBg: 'rgba(255,122,0,0.10)',
    glow: 'rgba(255,122,0,0.3)',
    features: ['CCTV Installation', 'Access Control', 'Monitoring', 'Maintenance'],
    href: '/security-services',
  },
  {
    id: 'gas',
    title: 'Gas Solutions',
    icon: '🔥',
    desc: 'Safe, certified LPG installations for residential and commercial properties. Gas geysers, hobs, fireplaces and bulk storage systems — installed to SANS standards.',
    color: '#ff7a00',
    iconBg: 'rgba(255,122,0,0.10)',
    glow: 'rgba(255,122,0,0.3)',
    features: ['Gas Geysers', 'Gas Hobs', 'Bulk Storage', 'CoC Certificates'],
    href: '/gas',
  },
]

export default function ServicesSection() {
  useEffect(() => {
    const sr = ScrollReveal({ reset: false })
    sr.reveal('.service-card', { origin: 'bottom', distance: '40px', duration: 800, interval: 140, delay: 100 })
    sr.reveal('.services-section .section-header', { origin: 'top', distance: '30px', duration: 700 })

    return () => (sr as any).destroy()
  }, [])

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Our <span>Services</span></h2>
          <p className="section-desc">
            Beyond security products, TRF Tech delivers comprehensive solutions across multiple industries — all backed by expert teams and quality guarantees.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => <ServiceCard key={s.id} data={s} />)}
        </div>
      </div>
    </section>
  )
}
