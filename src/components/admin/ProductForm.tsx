import { useState, FormEvent, useRef } from 'react'
import type { DbProduct, DbProductInsert, DbCategory } from '../../types'

interface Props {
  product?: DbProduct | null
  categories: DbCategory[]
  onSave: (data: DbProductInsert, imageFile?: File) => Promise<void>
  onCancel: () => void
}

const GRADIENTS = [
  'linear-gradient(135deg,rgba(0,212,255,0.14),rgba(0,100,200,0.14))',
  'linear-gradient(135deg,rgba(0,212,255,0.09),rgba(0,150,255,0.09))',
  'linear-gradient(135deg,rgba(0,212,255,0.10),rgba(123,47,255,0.10))',
  'linear-gradient(135deg,rgba(255,100,0,0.14),rgba(255,50,0,0.10))',
  'linear-gradient(135deg,rgba(0,255,150,0.12),rgba(0,200,100,0.10))',
]

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm({ product, categories, onSave, onCancel }: Props) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [compareAt, setCompareAt] = useState(String(product?.compare_at_price ?? ''))
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [icon, setIcon] = useState(product?.icon ?? '📦')
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [gradient, setGradient] = useState(product?.gradient ?? GRADIENTS[0])
  const [badge, setBadge] = useState(product?.badge ?? '')
  const [badgeClass, setBadgeClass] = useState(product?.badge_class ?? '')
  const [stock, setStock] = useState(String(product?.stock ?? '0'))
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data: DbProductInsert = {
        name,
        slug: slugify(name),
        description: description || null,
        price: parseFloat(price),
        compare_at_price: compareAt ? parseFloat(compareAt) : null,
        category_id: categoryId || null,
        icon,
        image_url: imageUrl || null,
        gradient,
        rating: product?.rating ?? 0,
        review_count: product?.review_count ?? 0,
        badge: badge || null,
        badge_class: badgeClass || null,
        stock: parseInt(stock) || 0,
        is_active: isActive,
        is_featured: isFeatured,
        tags: [],
      }
      await onSave(data, imageFile)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Product Name *">
          <input style={inp} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Centurion D5-Evo" />
        </Field>
        <Field label="Category">
          <select style={{ ...inp, ...optSel }} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="" style={opt}>— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} style={opt}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          style={{ ...inp, minHeight: 80, resize: 'vertical' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short product description…"
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <Field label="Price (R) *">
          <input style={inp} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" />
        </Field>
        <Field label="Compare-at Price (R)">
          <input style={inp} type="number" min="0" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="Old price" />
        </Field>
        <Field label="Stock">
          <input style={inp} type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Badge Text">
          <input style={inp} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Best Seller" />
        </Field>
        <Field label="Badge Style">
          <select style={{ ...inp, ...optSel }} value={badgeClass} onChange={(e) => setBadgeClass(e.target.value)}>
            <option value="" style={opt}>None</option>
            <option value="badge-primary" style={opt}>Blue (Primary)</option>
            <option value="badge-orange" style={opt}>Orange (Sale)</option>
            <option value="badge-green" style={opt}>Green (New)</option>
          </select>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'end' }}>
        <Field label="Icon">
          <input style={inp} value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📦" />
        </Field>
        <Field label="Card Gradient">
          <div style={{ display: 'flex', gap: 8 }}>
            {GRADIENTS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradient(g)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: g,
                  border: gradient === g ? '2px solid #00d4ff' : '2px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </Field>
      </div>

      <Field label="Image">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {(imagePreview || imageUrl) && (
            <img
              src={imagePreview ?? imageUrl}
              alt="preview"
              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
            />
          )}
          <button type="button" onClick={() => fileRef.current?.click()} style={ghostBtn}>
            Upload Image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: 'none' }}
          />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>or</span>
          <input
            style={{ ...inp, flex: 1, minWidth: 140 }}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL…"
          />
        </div>
      </Field>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <label style={checkLabel}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active (visible on site)
        </label>
        <label style={checkLabel}>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured
        </label>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: 8 }}>
        <button type="button" onClick={onCancel} style={ghostBtn} disabled={saving}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '0.6rem 1.5rem',
            background: saving ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.9)',
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: 5, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.7rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 7,
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const optSel: React.CSSProperties = {
  background: '#1a1a2e',
  colorScheme: 'dark',
}

const opt: React.CSSProperties = {
  background: '#1a1a2e',
  color: '#fff',
}

const ghostBtn: React.CSSProperties = {
  padding: '0.55rem 1rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  color: 'rgba(255,255,255,0.8)',
  fontSize: '0.85rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const checkLabel: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.875rem',
  cursor: 'pointer',
}
