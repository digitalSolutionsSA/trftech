interface Props {
  className?: string
  /** Horizontal lockup (atom beside "TRF TECH"), used in the navbar */
  wide?: boolean
  /** Light theme: the wide lockup's "TECH" is black instead of white */
  light?: boolean
}

export default function Logo({ className = 'navbar-logo-img', wide = false, light = false }: Props) {
  if (wide) {
    const src = light ? '/logo-trf-wide-light.png' : '/logo-trf-wide.png'
    return <img src={src} alt="TRF Tech" className={className} width={574} height={160} />
  }
  // Tightly cropped (the original logo-trf.png is mostly transparent padding) and sized for 2x screens
  return <img src="/logo-trf-mark.png" alt="TRF Tech" className={className} width={284} height={240} />
}
