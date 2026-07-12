import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import Logo from '../Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useCartStore((s) => s.count())
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = () => setMenuOpen((v) => !v)
  const closeMenu  = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <Logo />
          </Link>

          <ul className="navbar-links">
            <li><NavLink to="/#services"  onClick={() => { navigate('/'); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Services</NavLink></li>
            <li><NavLink to="/#products"  onClick={() => { navigate('/'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Products</NavLink></li>
            <li><NavLink to="/construction">Construction</NavLink></li>
            <li><NavLink to="/security-services">Security</NavLink></li>
            <li><NavLink to="/gas">Gas</NavLink></li>
          </ul>

          <div className="navbar-actions">
            <button className="cart-button" onClick={() => navigate('/cart')}>
              🛒 Cart
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : '' }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : '' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/"                   onClick={closeMenu}>🏠 Home</Link>
        <Link to="/construction"       onClick={closeMenu}>🏗️ Construction</Link>
        <Link to="/security-services"  onClick={closeMenu}>🛡️ Security Services</Link>
        <Link to="/gas"                onClick={closeMenu}>🔥 Gas Solutions</Link>
        <Link to="/cart"               onClick={closeMenu}>🛒 Cart {count > 0 ? `(${count})` : ''}</Link>
      </div>
    </>
  )
}
