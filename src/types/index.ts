export interface Product {
  id: number
  name: string
  category: 'gate-motors' | 'cameras' | 'electric-fencing' | 'alarm-systems'
  categoryLabel: string
  price: number
  oldPrice: number | null
  icon: string
  imageUrl: string
  gradient: string
  rating: number
  reviews: number
  badge: string | null
  badgeClass: string | null
  desc: string
  inStock: boolean
}

export type CategorySlug = 'gate-motors' | 'cameras' | 'electric-fencing' | 'alarm-systems'

export interface DbCategory {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface DbProduct {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  icon: string
  image_url: string | null
  gradient: string
  rating: number
  review_count: number
  badge: string | null
  badge_class: string | null
  stock: number
  is_active: boolean
  is_featured: boolean
  tags: string[]
  created_at: string
  updated_at: string
  categories?: DbCategory
}

export type DbProductInsert = Omit<DbProduct, 'id' | 'created_at' | 'updated_at' | 'categories'>
export type DbProductUpdate = Partial<DbProductInsert>

export interface CartItem {
  id: string
  name: string
  price: number
  category: string
  icon: string
  gradient: string
  qty: number
}

export interface ServiceCardData {
  id: string
  title: string
  icon: string
  desc: string
  color: string
  iconBg: string
  glow: string
  features: string[]
  href: string
}

export interface ToastData {
  id: string
  icon: string
  title: string
  message: string
}
