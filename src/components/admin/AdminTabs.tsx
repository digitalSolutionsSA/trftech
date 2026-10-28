import { NavLink } from 'react-router-dom'

const tab = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  padding: '0.35rem 0.75rem',
  borderRadius: 6,
  fontSize: '0.85rem',
  fontWeight: 600,
  textDecoration: 'none',
  color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
  background: isActive ? 'rgba(0,212,255,0.9)' : 'transparent',
})

/** Switches between the admin's sections; sits beside the "TRF Tech" title in each admin header. */
export default function AdminTabs({ newEnquiries }: { newEnquiries?: number }) {
  return (
    <nav style={{ display: 'flex', gap: 4 }}>
      <NavLink to="/admin/products" style={tab}>Products</NavLink>
      <NavLink to="/admin/enquiries" style={tab}>
        Enquiries{newEnquiries ? ` (${newEnquiries})` : ''}
      </NavLink>
    </nav>
  )
}
