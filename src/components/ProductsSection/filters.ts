import type { DbProduct } from '../../types'
import { scrollToId } from '../../lib/lenis'

export type FilterKey =
  | 'all' | 'ajax' | 'gate-motors' | 'cameras' | 'electric-fencing' | 'alarm-systems' | 'networking' | 'construction'

const isAjax = (p: DbProduct) =>
  p.categories?.slug === 'ajax' || /\bajax\b/i.test(p.name) || (p.tags ?? []).some((t) => /\bajax\b/i.test(t))

const inCategory = (slug: string) => (p: DbProduct) => p.categories?.slug === slug

export const FILTERS: { key: FilterKey; label: string; icon: string; match: (p: DbProduct) => boolean }[] = [
  { key: 'all',              label: 'All Products',     icon: '🛍️', match: () => true },
  // AJAX is a brand, not a product type: anything in the "ajax" category, or named/tagged Ajax,
  // so existing Ajax stock shows up here before it's moved into the new category
  { key: 'ajax',             label: 'AJAX',             icon: '🛡️', match: isAjax },
  { key: 'gate-motors',      label: 'Gate Motors',      icon: '⚙️', match: inCategory('gate-motors') },
  { key: 'cameras',          label: 'CCTV',             icon: '📷', match: inCategory('cameras') },
  { key: 'electric-fencing', label: 'Electric Fencing', icon: '⚡', match: inCategory('electric-fencing') },
  { key: 'alarm-systems',    label: 'Alarm Systems',    icon: '🔔', match: inCategory('alarm-systems') },
  { key: 'networking',       label: 'Networking',       icon: '🌐', match: inCategory('networking') },
  { key: 'construction',     label: 'Construction',     icon: '🏗️', match: inCategory('construction') },
]

export const BRANDS = ['Centurion', 'Hikvision', 'Dahua', 'Nemtek', 'DSC', 'Paradox', 'Ajax', 'Gallagher']

/** Brands aren't a column yet, so a product belongs to a brand when its name, tags or description say so. */
export const matchesBrand = (p: DbProduct, brand: string) => {
  const re = new RegExp(`\\b${brand}\\b`, 'i')
  return re.test(p.name) || (p.tags ?? []).some((t) => re.test(t)) || re.test(p.description ?? '')
}

/** Every word typed has to appear somewhere in the product's name, category, tags or description. */
export function matchesSearch(p: DbProduct, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = [p.name, p.categories?.name, ...(p.tags ?? []), p.description].filter(Boolean).join(' ').toLowerCase()
  return terms.every((t) => haystack.includes(t))
}

/** Has stock itself, or on any of its active variants. */
export const inStock = (p: DbProduct) =>
  p.stock > 0 || (p.product_variants ?? []).some((v) => v.is_active && v.stock > 0)

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'name' | 'rating'

/** No comparator keeps the order the products arrive in (newest first). */
export const SORTS: { key: SortKey; label: string; compare?: (a: DbProduct, b: DbProduct) => number }[] = [
  { key: 'relevance',  label: 'Newest' },
  { key: 'price-asc',  label: 'Price: low to high', compare: (a, b) => Number(a.price) - Number(b.price) },
  { key: 'price-desc', label: 'Price: high to low', compare: (a, b) => Number(b.price) - Number(a.price) },
  { key: 'name',       label: 'Name: A–Z',          compare: (a, b) => a.name.localeCompare(b.name) },
  { key: 'rating',     label: 'Top rated',          compare: (a, b) => b.rating - a.rating },
]

const SHOP_EVENT = 'trf:shop-filter'

/** Jump to the shop with a category already selected (used by the homepage tiles and ranges). */
export function openShop(key: FilterKey = 'all') {
  window.dispatchEvent(new CustomEvent<FilterKey>(SHOP_EVENT, { detail: key }))
  scrollToId('products')
}

export function onShopFilter(cb: (key: FilterKey) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<FilterKey>).detail)
  window.addEventListener(SHOP_EVENT, handler)
  return () => window.removeEventListener(SHOP_EVENT, handler)
}

/** On special: has a "was" price above the current one. */
export const isOnSpecial = (p: DbProduct) => p.compare_at_price != null && Number(p.compare_at_price) > Number(p.price)
