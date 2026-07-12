import { Link } from 'react-router-dom'
import Logo from '../Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="navbar-logo" style={{ marginBottom: 14 }}>
              <Logo className="footer-logo-img" />
            </div>
            <p className="footer-desc">
              South Africa's trusted security technology partner. Protecting homes and businesses since 2012 with cutting-edge systems and expert service.
            </p>
            <div className="footer-social">
              {['📘','📸','💬','💼'].map((icon, i) => (
                <a key={i} href="#" className="social-btn">{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              <li><Link to="/#products">→ All Products</Link></li>
              <li><Link to="/#services">→ Services</Link></li>
              <li><Link to="/construction">→ Construction</Link></li>
              <li><Link to="/security-services">→ Security Services</Link></li>
              <li><Link to="/gas">→ Gas Solutions</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <div className="footer-col-title">Products</div>
            <ul className="footer-links">
              <li><Link to="/#products">→ Gate Motors</Link></li>
              <li><Link to="/#products">→ CCTV Cameras</Link></li>
              <li><Link to="/#products">→ Electric Fencing</Link></li>
              <li><Link to="/#products">→ Alarm Systems</Link></li>
              <li><Link to="/cart">→ My Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>
            <div className="footer-contact">
              <div className="footer-contact-item"><span className="footer-contact-icon">📍</span> TRF Tech (Pty) Ltd — 17 Almond Str, Three Rivers, Vereeniging, 1935</div>
              <div className="footer-contact-item"><span className="footer-contact-icon">📞</span> 084 555 9862</div>
              <div className="footer-contact-item"><span className="footer-contact-icon">✉️</span> sales@trftech.co.za</div>
              <div className="footer-contact-item"><span className="footer-contact-icon">🕐</span> Mon–Fri: 08:00–17:00 | Sat: 08:00–13:00</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2025 TRF Tech. All rights reserved.</div>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Warranty Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
