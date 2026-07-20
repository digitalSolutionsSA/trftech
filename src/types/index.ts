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

export interface CartItem {
  id: number
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
