import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`page-loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-logo">TRF TECH</div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
    </div>
  )
}
