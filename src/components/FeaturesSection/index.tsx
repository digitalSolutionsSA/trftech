const STATS = [
  { count: 500, suffix: '+', label: 'Products online' },
  { count: 12, suffix: '', label: 'Years experience' },
  { count: 98, suffix: '%', label: 'Client satisfaction' },
  { count: 24, suffix: '/7', label: 'Technical support' },
]

const FEATURES = [
  { title: 'Fast Nationwide Delivery', desc: 'Same-day dispatch on in-stock items. Deliveries across all provinces within 2–5 business days.' },
  { title: 'Expert Advice', desc: 'Not sure what you need? Send us an enquiry and our team will recommend the right equipment for your property and budget, with a no-obligation quote.' },
  { title: 'Manufacturer Warranty', desc: 'All products carry full manufacturer warranty — 1 to 5 years. We handle all warranty claims on your behalf.' },
  { title: '24/7 Technical Support', desc: 'Our technical team is available around the clock for product support, setup help and remote diagnostics.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="advantage">
      <div className="container">
        <div className="sec-head sec-head--split">
          <div>
            <p className="hud-label eyebrow2"><span data-scramble>Why TRF Tech</span></p>
            <h2 className="display sec-title" data-glitch>The TRF <span className="text-armed">Advantage</span></h2>
          </div>
          <p className="sec-sub" data-sr="right">
            We go beyond selling products — every order is backed by expert advice, genuine
            warranties and ongoing support.
          </p>
        </div>

        <dl className="advantage__stats">
          {STATS.map((s) => (
            <div key={s.label} className="advantage__stat">
              <dd className="display" data-count={s.count} data-suffix={s.suffix}>{s.count}{s.suffix}</dd>
              <dt className="hud-label">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="advantage__list" data-sr-children="left" data-sr-interval="120">
          {FEATURES.map((f, i) => (
            <div className="advantage__row" key={f.title}>
              <span className="hud-label advantage__idx">0{i + 1}</span>
              <h3 className="advantage__title">{f.title}</h3>
              <p className="advantage__desc">{f.desc}</p>
              <span className="advantage__check" aria-hidden>✓</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
