import { Link } from 'react-router-dom'
import type { ServiceCardData } from '../types'

interface Props {
  data: ServiceCardData
}

export default function ServiceCard({ data }: Props) {
  return (
    <Link
      to={data.href}
      className="service-card"
      style={{ '--sc-color': data.color } as React.CSSProperties}
    >
      <div className="sc-icon" style={{ background: data.iconBg, border: '1px solid rgba(255,255,255,0.07)' }}>
        {data.icon}
      </div>
      <h3 className="sc-title">{data.title}</h3>
      <p className="sc-desc">{data.desc}</p>
      <div className="sc-tags">
        {data.features.map((f) => (
          <span key={f} className="sc-tag">{f}</span>
        ))}
      </div>
      <span className="sc-link" style={{ color: data.color }}>
        Learn More →
      </span>
    </Link>
  )
}
