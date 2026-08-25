const SECURITY_SERVICES = [
  {
    icon: '📷',
    title: 'CCTV',
    desc: 'Professional HD camera installation for homes, offices and commercial sites. Remote monitoring via smartphone included.',
    tags: ['HD Cameras', 'Remote View', 'Night Vision', 'IP67 Rated'],
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🔔',
    title: 'Security',
    desc: 'Complete alarm installation with PIR sensors, door contacts, sirens and optional armed-response monitoring.',
    tags: ['PIR Sensors', 'GSM Backup', 'App Control', 'Armed Response'],
    img: 'https://images.unsplash.com/photo-1634224143538-ce0221abf732?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🔑',
    title: 'Networking',
    desc: 'Intercoms, biometric readers, key fobs and gate automation — full access management for any property.',
    tags: ['Biometrics', 'Key Fobs', 'Intercoms', 'Gate Motors'],
    img: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '⚡',
    title: 'Construction',
    desc: 'Design and installation of electric perimeter fences with alarm integration and compliance certificates.',
    tags: ['Perimeter', 'Alarm Link', 'CoC Cert', 'SANS 10222'],
    img: 'https://images.unsplash.com/photo-1549109926-9620d1b9bfa2?w=500&q=80&auto=format&fit=crop',
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Professional Installation</div>
          <h2 className="section-title">Security <span>Services</span></h2>
          <p className="section-desc">
            Expert installation and maintenance by certified technicians — all work backed by a 12-month workmanship guarantee.
          </p>
        </div>

        <div className="ss-grid">
          {SECURITY_SERVICES.map((s) => (
            <div className="ss-card" key={s.title}>
              <div className="ss-img-wrap">
                <img src={s.img} alt={s.title} className="ss-img" loading="lazy" />
                <div className="ss-img-overlay" />
                <span className="ss-icon">{s.icon}</span>
              </div>
              <div className="ss-body">
                <div className="ss-title">{s.title}</div>
                <p className="ss-desc">{s.desc}</p>
                <div className="ss-tags">
                  {s.tags.map((t) => <span key={t} className="ss-tag">{t}</span>)}
                </div>
                <a
                  href="#enquiry"
                  className="ss-cta"
                  onClick={(e) => { e.preventDefault(); document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Get a Quote →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
