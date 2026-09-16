import { useState, useRef } from 'react'
import type { DbProduct, DbProductVariant, DbProductVariantInsert, DbProductVariantUpdate } from '../../types'

interface Props {
  product: DbProduct
  onUploadImage: (file: File) => Promise<string>
  onCreate: (data: DbProductVariantInsert) => Promise<unknown>
  onUpdate: (id: string, productId: string, data: DbProductVariantUpdate) => Promise<unknown>
  onRemove: (id: string, productId: string) => Promise<unknown>
  onClose: () => void
}

export default function VariantsManager({ product, onUploadImage, onCreate, onUpdate, onRemove, onClose }: Props) {
  const variants = product.product_variants ?? []

  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
        Add size/spec options for <strong style={{ color: '#fff' }}>{product.name}</strong> — e.g. "25x16" and "25x25" —
        each with its own price, image and stock. Shoppers pick one on the product page instead of you uploading separate products.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {variants.length === 0 && (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 10 }}>
            No variants yet — add the first size/spec option below.
          </div>
        )}
        {variants.map((v) => (
          <VariantRow
            key={v.id}
            variant={v}
            onUploadImage={onUploadImage}
            onSave={(data) => onUpdate(v.id, product.id, data)}
            onRemove={() => onRemove(v.id, product.id)}
          />
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          Add Variant
        </div>
        <NewVariantForm
          productId={product.id}
          nextSortOrder={variants.length}
          onUploadImage={onUploadImage}
          onCreate={onCreate}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
        <button onClick={onClose} style={primaryBtn}>Done</button>
      </div>
    </div>
  )
}

function VariantRow({
  variant, onUploadImage, onSave, onRemove,
}: {
  variant: DbProductVariant
  onUploadImage: (file: File) => Promise<string>
  onSave: (data: DbProductVariantUpdate) => Promise<unknown>
  onRemove: () => Promise<unknown>
}) {
  const [label, setLabel] = useState(variant.label)
  const [price, setPrice] = useState(String(variant.price))
  const [compareAt, setCompareAt] = useState(variant.compare_at_price != null ? String(variant.compare_at_price) : '')
  const [stock, setStock] = useState(String(variant.stock))
  const [imageUrl, setImageUrl] = useState(variant.image_url ?? '')
  const [isActive, setIsActive] = useState(variant.is_active)
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const mark = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setDirty(true) }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let finalImageUrl = imageUrl || null
      if (imageFile) finalImageUrl = await onUploadImage(imageFile)
      await onSave({
        label,
        price: parseFloat(price) || 0,
        compare_at_price: compareAt ? parseFloat(compareAt) : null,
        stock: parseInt(stock) || 0,
        image_url: finalImageUrl,
        is_active: isActive,
        sort_order: variant.sort_order,
      })
      setDirty(false)
      setImageFile(undefined)
      if (finalImageUrl) setImageUrl(finalImageUrl)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm(`Remove variant "${variant.label}"?`)) return
    setRemoving(true)
    await onRemove()
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '52px 1fr 100px 110px 80px auto', gap: 10, alignItems: 'center',
      padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
    }}>
      <div style={{ position: 'relative' }}>
        {(imagePreview || imageUrl) ? (
          <img src={imagePreview ?? imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileRef.current?.click()} title="Change image" style={imgBtn}>✎</button>
      </div>
      <input style={inp} value={label} onChange={(e) => mark(setLabel)(e.target.value)} placeholder="e.g. 25x16" />
      <input style={inp} type="number" min="0" step="0.01" value={price} onChange={(e) => mark(setPrice)(e.target.value)} placeholder="Price" />
      <input style={inp} type="number" min="0" step="0.01" value={compareAt} onChange={(e) => mark(setCompareAt)(e.target.value)} placeholder="Was (optional)" />
      <input style={inp} type="number" min="0" value={stock} onChange={(e) => mark(setStock)(e.target.value)} placeholder="Stock" />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <label title="Active" style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={isActive} onChange={(e) => mark(setIsActive)(e.target.checked)} />
        </label>
        <button type="button" onClick={handleSave} disabled={!dirty || saving} style={{ ...ghostBtn, opacity: !dirty || saving ? 0.5 : 1 }}>
          {saving ? '…' : 'Save'}
        </button>
        <button type="button" onClick={handleRemove} disabled={removing} style={{ ...ghostBtn, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
          {removing ? '…' : 'Del'}
        </button>
      </div>
    </div>
  )
}

function NewVariantForm({
  productId, nextSortOrder, onUploadImage, onCreate,
}: {
  productId: string
  nextSortOrder: number
  onUploadImage: (file: File) => Promise<string>
  onCreate: (data: DbProductVariantInsert) => Promise<unknown>
}) {
  const [label, setLabel] = useState('')
  const [price, setPrice] = useState('')
  const [compareAt, setCompareAt] = useState('')
  const [stock, setStock] = useState('0')
  const [imageUrl, setImageUrl] = useState('')
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

  const reset = () => {
    setLabel(''); setPrice(''); setCompareAt(''); setStock('0')
    setImageUrl(''); setImageFile(undefined); setImagePreview(null)
  }

  const handleAdd = async () => {
    setError('')
    if (!label.trim()) { setError('Give this variant a label, e.g. "25x16"'); return }
    if (!price) { setError('Set a price for this variant'); return }
    setSaving(true)
    try {
      let finalImageUrl = imageUrl || null
      if (imageFile) finalImageUrl = await onUploadImage(imageFile)
      await onCreate({
        product_id: productId,
        label: label.trim(),
        price: parseFloat(price) || 0,
        compare_at_price: compareAt ? parseFloat(compareAt) : null,
        image_url: finalImageUrl,
        stock: parseInt(stock) || 0,
        sort_order: nextSortOrder,
        is_active: true,
      })
      reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not add variant')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 100px 110px 80px auto', gap: 10, alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        {(imagePreview || imageUrl) ? (
          <img src={imagePreview ?? imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px dashed rgba(255,255,255,0.15)' }} />
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileRef.current?.click()} title="Add image" style={imgBtn}>✎</button>
      </div>
      <input style={inp} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. 25x16" />
      <input style={inp} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <input style={inp} type="number" min="0" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="Was (optional)" />
      <input style={inp} type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />
      <button type="button" onClick={handleAdd} disabled={saving} style={{ ...primaryBtn, padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
        {saving ? '…' : '+ Add'}
      </button>
      {error && <div style={{ gridColumn: '1 / -1', color: '#f87171', fontSize: '0.78rem' }}>{error}</div>}
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.6rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 7,
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const ghostBtn: React.CSSProperties = {
  padding: '0.4rem 0.7rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 7,
  color: 'rgba(255,255,255,0.8)',
  fontSize: '0.78rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const primaryBtn: React.CSSProperties = {
  padding: '0.6rem 1.25rem',
  background: 'rgba(0,212,255,0.9)',
  border: 'none',
  borderRadius: 8,
  color: '#000',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const imgBtn: React.CSSProperties = {
  position: 'absolute',
  bottom: -4,
  right: -4,
  width: 18,
  height: 18,
  borderRadius: '50%',
  background: '#00d4ff',
  color: '#000',
  border: 'none',
  fontSize: '0.6rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
}
