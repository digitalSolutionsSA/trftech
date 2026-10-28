import { scrollToId } from '../../lib/lenis'

const SECURITY_SERVICES = [
  {
    title: 'CCTV',
    desc: 'Professional HD camera installation for homes, offices and commercial sites. Remote monitoring via smartphone included.',
    tags: ['HD Cameras', 'Remote View', 'Night Vision', 'IP67 Rated'],
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Security',
    desc: 'Complete alarm installation with PIR sensors, door contacts, sirens and optional armed-response monitoring.',
    tags: ['PIR Sensors', 'GSM Backup', 'App Control', 'Armed Response'],
    img: 'https://images.unsplash.com/photo-1634224143538-ce0221abf732?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Networking',
    desc: 'Intercoms, biometric readers, key fobs and gate automation — full access management for any property.',
    tags: ['Biometrics', 'Key Fobs', 'Intercoms', 'Gate Motors'],
    img: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Construction',
    desc: 'Design and installation of electric perimeter fences with alarm integration and compliance certificates.',
    tags: ['Perimeter', 'Alarm Link', 'CoC Cert', 'SANS 10222'],
    img: 'https://images.unsplash.com/photo-1549109926-9620d1b9bfa2?w=800&q=80&auto=format&fit=crop',
  },
]

/** Services shown as live camera feeds: each panel wipes open, its image drifts with the scroll. */
export default function ServicesSection() {
  return (
    <section id="services" className="feeds">
      <div className="container">
        <div className="sec-head">
          <p className="hud-label eyebrow2"><span data-scramble>Professional installation</span></p>
          <h2 className="display sec-title" data-glitch>Security <span className="text-armed">Services</span></h2>
          <p className="sec-sub" data-sr="rise" data-sr-delay="150">
            Expert installation and maintenance by certified technicians — all work backed by a
            12-month workmanship guarantee.
          </p>
        </div>

        <div className="feeds__grid">
          {SECURITY_SERVICES.map((s, i) => (
            <article className="feed" key={s.title} data-clip>
              <div className="feed__media">
                <img src={s.img} alt={s.title} className="feed__img" loading="lazy" data-float="8" />
                <div className="feed__tint" />
                <div className="feed__hud hud-label">
                  <span><span className="rec-dot" /> FEED 0{i + 1}</span>
                  <span>REC</span>
                </div>
                <span className="feed__bracket feed__bracket--tl" />
                <span className="feed__bracket feed__bracket--br" />
              </div>
              <div className="feed__body">
                <h3 className="display feed__title">{s.title}</h3>
                <p className="feed__desc">{s.desc}</p>
                <ul className="feed__tags">
                  {s.tags.map((t) => <li key={t} className="hud-label">{t}</li>)}
                </ul>
                <a href="#enquiry" className="feed__cta hud-label"
                  onClick={(e) => { e.preventDefault(); scrollToId('enquiry') }}>
                  Get a quote <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
