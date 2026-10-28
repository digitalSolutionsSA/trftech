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
