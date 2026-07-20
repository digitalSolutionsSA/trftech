import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useThemeStore } from '../../store/themeStore'
import Logo from '../Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count    = useCartStore((s) => s.count())
  const navigate = useNavigate()
  const { theme, toggle } = useThemeStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const scrollTo = (id: string) => {
    closeMenu()
    navigate('/')
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
  }

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <Logo />
          </Link>

          <ul className="navbar-links">
            <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
            <li><a role="button" onClick={() => scrollTo('products')}>Shop</a></li>
            <li><a role="button" onClick={() => scrollTo('services')}>Services</a></li>
            <li><a role="button" onClick={() => scrollTo('enquiry')}>Construction &amp; Gas</a></li>
            <li><a role="button" onClick={() => scrollTo('features')}>About</a></li>
          </ul>

          <div className="navbar-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggle}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon icon */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <button className="cart-button" onClick={() => navigate('/cart')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Cart
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>

            <button className="hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : '' }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : '' }} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <a role="button" onClick={() => scrollTo('products')}>Shop Products</a>
        <a role="button" onClick={() => scrollTo('services')}>Security Services</a>
        <a role="button" onClick={() => scrollTo('enquiry')}>Construction &amp; Gas</a>
        <Link to="/cart" onClick={closeMenu}>
          Cart {count > 0 ? `(${count})` : ''}
        </Link>
        <button className="mobile-theme-btn" onClick={() => { toggle(); closeMenu() }}>
          {theme === 'dark' ? '☀  Switch to Light Mode' : '☾  Switch to Dark Mode'}
        </button>
      </div>
    </>
  )
}
