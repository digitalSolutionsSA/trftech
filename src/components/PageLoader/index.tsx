import { useEffect, useState } from 'react'
import Logo from '../Logo'

export default function PageLoader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`page-loader${hidden ? ' hidden' : ''}`}>
      <Logo className="loader-logo-img" />
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
    </div>
  )
}
