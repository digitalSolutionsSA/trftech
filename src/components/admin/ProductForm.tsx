import { useState, FormEvent, useRef } from 'react'
import type { DbProduct, DbProductInsert, DbCategory } from '../../types'

export interface DraftVariant {
  label: string
  price: number
  compare_at_price: number | null
  stock: number
}

interface VariantRowState {
  key: number
  label: string
  price: string
  compareAt: string
  stock: string
}

interface Props {
  product?: DbProduct | null
  categories: DbCategory[]
  onSave: (data: DbProductInsert, imageFile?: File, variants?: DraftVariant[]) => Promise<void>
  onCancel: () => void
}

let rowKey = 0
const emptyRow = (): VariantRowState => ({ key: ++rowKey, label: '', price: '', compareAt: '', stock: '0' })

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
  const [variantRows, setVariantRows] = useState<VariantRowState[]>([])
  const existingVariantCount = product?.product_variants?.length ?? 0
  const hasVariants = variantRows.length > 0

  const updateRow = (key: number, field: keyof Omit<VariantRowState, 'key'>, value: string) =>
    setVariantRows((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  const removeRow = (key: number) => setVariantRows((rows) => rows.filter((r) => r.key !== key))
  const addRow = () => setVariantRows((rows) => [...rows, emptyRow()])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Ignore completely blank variant rows; every other row needs a label and price.
    const filledRows = variantRows.filter((r) => r.label.trim() || r.price || r.compareAt)
    for (const r of filledRows) {
      if (!r.label.trim()) { setError('Each variant needs a label, e.g. "1m" or "5m"'); return }
      if (!r.price || isNaN(parseFloat(r.price))) { setError(`Set a price for variant "${r.label.trim()}"`); return }
    }
    const variants: DraftVariant[] = filledRows.map((r) => ({
      label: r.label.trim(),
      price: parseFloat(r.price),
      compare_at_price: r.compareAt ? parseFloat(r.compareAt) : null,
      stock: parseInt(r.stock) || 0,
    }))
    if (!variants.length && (!price || isNaN(parseFloat(price)))) { setError('Set a price, or add variants with their own prices'); return }
    // Price/stock summary across existing (when editing) + new variants
    const allVariants = [
      ...(variants.length ? (product?.product_variants ?? []).map((v) => ({ price: Number(v.price), stock: v.stock })) : []),
      ...variants,
    ]

    setSaving(true)
    try {
      const data: DbProductInsert = {
        name,
        slug: slugify(name),
        description: description || null,
        // With variants, the product's own price/stock act as "from" price and total stock.
        price: variants.length ? Math.min(...allVariants.map((v) => v.price)) : parseFloat(price),
        compare_at_price: variants.length ? null : compareAt ? parseFloat(compareAt) : null,
        category_id: categoryId || null,
        icon,
        image_url: imageUrl || null,
        gradient,
        rating: product?.rating ?? 0,
        review_count: product?.review_count ?? 0,
        badge: badge || null,
        badge_class: badgeClass || null,
        stock: variants.length ? allVariants.reduce((s, v) => s + v.stock, 0) : parseInt(stock) || 0,
        is_active: isActive,
        is_featured: isFeatured,
        tags: product?.tags ?? [],
      }
      await onSave(data, imageFile, variants)
    } catch (err: unknown) {
      // Supabase errors are plain objects (not Error instances) but carry a message
      const msg =
        err instanceof Error ? err.message
        : err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message)
        : 'Something went wrong'
      setError(msg)
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

      {!hasVariants && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Field label="Price (R) *">
            <input style={inp} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Compare-at Price (R)">
            <input style={inp} type="number" min="0" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="Old price" />
          </Field>
          <Field label="Stock">
            <input style={inp} type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />
          </Field>
        </div>
      )}

      {/* Variants: e.g. a cable sold in 1m / 5m / 10m lengths, each with its own price and stock */}
      <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.9rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: hasVariants ? 10 : 0 }}>
          <div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
              Variants {existingVariantCount > 0 && <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({existingVariantCount} existing)</span>}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 2 }}>
              {product
                ? existingVariantCount > 0
                  ? 'Edit or remove existing variants with the Variants button in the product list. Add more below.'
                  : 'Sell this product in different sizes/lengths, e.g. 1m, 5m, 10m — each with its own price.'
                : 'Sell this product in different sizes/lengths, e.g. 1m, 5m, 10m — each with its own price.'}
            </div>
          </div>
          <button type="button" onClick={addRow} style={ghostBtn}>+ Add Variant</button>
        </div>

        {hasVariants && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: variantGrid, gap: 8, color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 500 }}>
              <span>Label *</span><span>Price (R) *</span><span>Was (R)</span><span>Stock</span><span />
            </div>
            {variantRows.map((r) => (
              <div key={r.key} style={{ display: 'grid', gridTemplateColumns: variantGrid, gap: 8, alignItems: 'center' }}>
                <input style={inp} value={r.label} onChange={(e) => updateRow(r.key, 'label', e.target.value)} placeholder="e.g. 5m" />
                <input style={inp} type="number" min="0" step="0.01" value={r.price} onChange={(e) => updateRow(r.key, 'price', e.target.value)} placeholder="0.00" />
                <input style={inp} type="number" min="0" step="0.01" value={r.compareAt} onChange={(e) => updateRow(r.key, 'compareAt', e.target.value)} placeholder="Optional" />
                <input style={inp} type="number" min="0" value={r.stock} onChange={(e) => updateRow(r.key, 'stock', e.target.value)} placeholder="0" />
                <button type="button" onClick={() => removeRow(r.key)} title="Remove variant" style={{ ...ghostBtn, padding: '0.5rem 0.7rem', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>✕</button>
              </div>
            ))}
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
              Shoppers choose a variant on the product card. The product shows "From R…" using the lowest variant price.
            </div>
          </div>
        )}
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

const variantGrid = '1.4fr 1fr 1fr 0.8fr auto'

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
