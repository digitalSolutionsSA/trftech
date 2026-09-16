import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminProducts, useCategories } from '../../hooks/useProducts'
import { useAuth } from '../../hooks/useAuth'
import ProductForm from '../../components/admin/ProductForm'
import VariantsManager from '../../components/admin/VariantsManager'
import type { DbProduct, DbProductInsert } from '../../types'

export default function AdminProducts() {
  const { user, signOut } = useAuth()
  const { products, loading, error, create, update, remove, uploadImage, createVariant, updateVariant, removeVariant } = useAdminProducts()
  const { categories } = useCategories()
  const navigate = useNavigate()

  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<DbProduct | null>(null)
  const [variantsTargetId, setVariantsTargetId] = useState<string | null>(null)
  const variantsTarget = variantsTargetId ? products.find((p) => p.id === variantsTargetId) ?? null : null
  const [deleteTarget, setDeleteTarget] = useState<DbProduct | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = async (data: DbProductInsert, imageFile?: File) => {
    let finalData = data
    if (imageFile) {
      const url = await uploadImage(imageFile)
      finalData = { ...data, image_url: url }
    }
    if (editing) {
      await update(editing.id, finalData)
      showToast('Product updated successfully')
    } else {
      await create(finalData)
      showToast('Product added successfully')
    }
    setModal(null)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await remove(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    showToast('Product deleted')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || p.category_id === filterCat
    return matchSearch && matchCat
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0a0f)', color: '#fff', fontFamily: 'inherit' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00d4ff' }}>TRF Tech</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>/ Admin / Products</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{user?.email}</span>
          <button onClick={handleSignOut} style={ghostBtn}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, flex: '0 0 auto' }}>Products</h1>
          <input
            style={{ ...inp, maxWidth: 240 }}
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={{ ...inp, maxWidth: 180, background: '#1a1a2e', colorScheme: 'dark' }}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="" style={{ background: '#1a1a2e', color: '#fff' }}>All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} style={{ background: '#1a1a2e', color: '#fff' }}>{c.name}</option>
            ))}
          </select>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { setEditing(null); setModal('add') }}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'rgba(0,212,255,0.9)',
              border: 'none',
              borderRadius: 8,
              color: '#000',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            + Add Product
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Active', value: products.filter((p) => p.is_active).length },
            {
              label: 'Out of Stock',
              value: products.filter((p) =>
                p.product_variants && p.product_variants.length > 0
                  ? p.product_variants.every((v) => v.stock === 0)
                  : p.stock === 0
              ).length,
            },
            { label: 'Featured', value: products.filter((p) => p.is_featured).length },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              minWidth: 120,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00d4ff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            {products.length === 0 ? 'No products yet. Add your first product!' : 'No products match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                  <th style={th}>Product</th>
                  <th style={th}>Category</th>
                  <th style={th}>Price</th>
                  <th style={th}>Stock</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 6, background: product.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                            {product.icon}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{product.name}</div>
                          {product.badge && (
                            <span style={{ fontSize: '0.7rem', color: '#00d4ff', background: 'rgba(0,212,255,0.12)', padding: '1px 6px', borderRadius: 4 }}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {product.categories?.name ?? '—'}
                      </span>
                    </td>
                    <td style={td}>
                      {product.product_variants && product.product_variants.length > 0 ? (
                        <div style={{ fontWeight: 600 }}>
                          From R {Math.min(...product.product_variants.map((v) => Number(v.price))).toLocaleString()}
                        </div>
                      ) : (
                        <>
                          <div style={{ fontWeight: 600 }}>R {product.price.toLocaleString()}</div>
                          {product.compare_at_price && (
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                              R {product.compare_at_price.toLocaleString()}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td style={td}>
                      {product.product_variants && product.product_variants.length > 0 ? (
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {product.product_variants.reduce((sum, v) => sum + v.stock, 0)} across variants
                        </span>
                      ) : (
                        <span style={{ color: product.stock === 0 ? '#f87171' : product.stock < 5 ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}>
                          {product.stock === 0 ? 'Out of stock' : product.stock}
                        </span>
                      )}
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: product.is_active ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
                        color: product.is_active ? '#34d399' : 'rgba(255,255,255,0.3)',
                      }}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => { setEditing(product); setModal('edit') }}
                          style={{ ...ghostBtn, padding: '4px 12px', fontSize: '0.8rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setVariantsTargetId(product.id)}
                          style={{ ...ghostBtn, padding: '4px 12px', fontSize: '0.8rem' }}
                        >
                          Variants{product.product_variants && product.product_variants.length > 0 ? ` (${product.product_variants.length})` : ''}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          style={{ ...ghostBtn, padding: '4px 12px', fontSize: '0.8rem', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) { setModal(null); setEditing(null) } }}>
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '1.75rem',
            width: '100%',
            maxWidth: 680,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              {editing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              product={editing}
              categories={categories}
              onSave={handleSave}
              onCancel={() => { setModal(null); setEditing(null) }}
            />
          </div>
        </div>
      )}

      {/* Variants Modal */}
      {variantsTarget && (
        <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) setVariantsTargetId(null) }}>
          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '1.75rem',
            width: '100%',
            maxWidth: 760,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 700 }}>
              Manage Variants
            </h2>
            <VariantsManager
              product={variantsTarget}
              onUploadImage={uploadImage}
              onCreate={createVariant}
              onUpdate={updateVariant}
              onRemove={removeVariant}
              onClose={() => setVariantsTargetId(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div style={overlay}>
          <div style={{
            background: '#111118',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 420,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Delete Product?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
              <strong style={{ color: '#fff' }}>{deleteTarget.name}</strong> will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} style={ghostBtn} disabled={deleting}>Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ ...ghostBtn, background: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          background: 'rgba(52,211,153,0.15)',
          border: '1px solid rgba(52,211,153,0.4)',
          borderRadius: 10,
          padding: '0.75rem 1.25rem',
          color: '#34d399',
          fontSize: '0.875rem',
          fontWeight: 600,
          zIndex: 100,
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  )
}

const inp: React.CSSProperties = {
  padding: '0.55rem 0.75rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
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

const th: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const td: React.CSSProperties = {
  padding: '0.75rem 0.75rem',
  verticalAlign: 'middle',
}

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
