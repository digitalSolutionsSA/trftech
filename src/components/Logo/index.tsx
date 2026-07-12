interface Props {
  className?: string
}

export default function Logo({ className = 'navbar-logo-img' }: Props) {
  return <img src="/logo-trf.png" alt="TRF Tech" className={className} />
}
