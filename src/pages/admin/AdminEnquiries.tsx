import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import AdminTabs from '../../components/admin/AdminTabs'
import type { Enquiry, EnquiryStatus } from '../../lib/enquiries'

const STATUSES: { key: EnquiryStatus; label: string; color: string }[] = [
  { key: 'new',       label: 'New',       color: '#fbbf24' },
  { key: 'contacted', label: 'Contacted', color: '#00d4ff' },
  { key: 'closed',    label: 'Closed',    color: 'rgba(255,255,255,0.4)' },
]
const SOURCE_LABEL: Record<Enquiry['source'], string> = { home: 'Homepage form', security: 'Security Services form' }

const when = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
})

export default function AdminEnquiries() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('new')
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setEnquiries(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (e: Enquiry, status: EnquiryStatus) => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', e.id)
    if (error) { setError(error.message); return }
    setEnquiries((prev) => prev.map((x) => (x.id === e.id ? { ...x, status } : x)))
  }

  const remove = async () => {
    if (!deleteTarget) return
    const { error } = await supabase.from('enquiries').delete().eq('id', deleteTarget.id)
    if (error) setError(error.message)
    else setEnquiries((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  const count = (s: EnquiryStatus) => enquiries.filter((e) => e.status === s).length
  const shown = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0a0f)', color: '#fff', fontFamily: 'inherit' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00d4ff' }}>TRF Tech</span>
          <AdminTabs newEnquiries={count('new')} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{user?.email}</span>
          <button onClick={handleSignOut} style={ghostBtn}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Enquiries</h1>
          <div style={{ flex: 1 }} />
          {[{ key: 'all' as const, label: 'All', n: enquiries.length }, ...STATUSES.map((s) => ({ key: s.key, label: s.label, n: count(s.key) }))].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{ ...ghostBtn, ...(filter === f.key ? { background: 'rgba(0,212,255,0.15)', borderColor: 'rgba(0,212,255,0.5)', color: '#00d4ff' } : {}) }}
            >
              {f.label} ({f.n})
            </button>
          ))}
          <button onClick={load} style={ghostBtn}>Refresh</button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={empty}>Loading enquiries…</div>
        ) : shown.length === 0 ? (
          <div style={empty}>{enquiries.length === 0 ? 'No enquiries yet.' : 'Nothing here — try another filter.'}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shown.map((e) => {
              const status = STATUSES.find((s) => s.key === e.status)!
              return (
                <article key={e.id} style={{
                  padding: '1rem 1.25rem', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${e.status === 'new' ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{e.name}</div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 4, fontSize: '0.875rem' }}>
                        <a href={`tel:${e.phone.replace(/\s+/g, '')}`} style={link}>{e.phone}</a>
                        {e.email && <a href={`mailto:${e.email}`} style={link}>{e.email}</a>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      <div>{when.format(new Date(e.created_at))}</div>
                      <div>{SOURCE_LABEL[e.source]}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    {e.service && <span style={chip}>{e.service}</span>}
                    {e.property_type && <span style={chip}>{e.property_type}</span>}
                  </div>
                  {e.message && (
                    <p style={{ margin: '10px 0 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {e.message}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: status.color }}>● {status.label}</span>
                    <div style={{ flex: 1 }} />
                    {STATUSES.filter((s) => s.key !== e.status).map((s) => (
                      <button key={s.key} onClick={() => setStatus(e, s.key)} style={ghostBtn}>Mark {s.label.toLowerCase()}</button>
                    ))}
                    <button onClick={() => setDeleteTarget(e)} style={{ ...ghostBtn, color: '#f87171' }}>Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div style={overlay} onClick={() => setDeleteTarget(null)}>
          <div onClick={(ev) => ev.stopPropagation()} style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1.5rem', maxWidth: 380, width: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Delete enquiry?</h3>
            <p style={{ margin: '0 0 1.25rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
              The enquiry from <strong>{deleteTarget.name}</strong> will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} style={ghostBtn}>Cancel</button>
              <button onClick={remove} style={{ ...ghostBtn, background: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ghostBtn: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 7,
  color: 'rgba(255,255,255,0.75)',
  fontSize: '0.825rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const chip: React.CSSProperties = {
  fontSize: '0.75rem',
  padding: '2px 8px',
  borderRadius: 4,
  color: '#00d4ff',
  background: 'rgba(0,212,255,0.1)',
}

const link: React.CSSProperties = { color: '#00d4ff', textDecoration: 'none' }

const empty: React.CSSProperties = { textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: '1rem',
}
