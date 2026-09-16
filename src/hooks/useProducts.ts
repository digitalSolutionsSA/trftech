import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { DbProduct, DbProductInsert, DbProductUpdate, DbCategory, DbProductVariantInsert, DbProductVariantUpdate } from '../types'

const PRODUCT_SELECT = '*, categories(id,name,slug), product_variants(*)'

function sortVariants(product: DbProduct): DbProduct {
  if (!product.product_variants) return product
  return { ...product, product_variants: [...product.product_variants].sort((a, b) => a.sort_order - b.sort_order) }
}

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setCategories(data ?? [])
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}

export function useAdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProducts((data ?? []).map(sortVariants))
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (product: DbProductInsert) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select(PRODUCT_SELECT)
      .single()
    if (error) throw error
    setProducts((prev) => [sortVariants(data), ...prev])
    return data
  }

  const update = async (id: string, product: DbProductUpdate) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select(PRODUCT_SELECT)
      .single()
    if (error) throw error
    setProducts((prev) => prev.map((p) => (p.id === id ? sortVariants(data) : p)))
    return data
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const refreshProduct = async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', productId)
      .single()
    if (error) throw error
    setProducts((prev) => prev.map((p) => (p.id === productId ? sortVariants(data) : p)))
    return data
  }

  const createVariant = async (variant: DbProductVariantInsert) => {
    const { error } = await supabase.from('product_variants').insert(variant)
    if (error) throw error
    return refreshProduct(variant.product_id)
  }

  const updateVariant = async (id: string, productId: string, variant: DbProductVariantUpdate) => {
    const { error } = await supabase.from('product_variants').update(variant).eq('id', id)
    if (error) throw error
    return refreshProduct(productId)
  }

  const removeVariant = async (id: string, productId: string) => {
    const { error } = await supabase.from('product_variants').delete().eq('id', id)
    if (error) throw error
    return refreshProduct(productId)
  }

  return {
    products, loading, error, create, update, remove, uploadImage, refetch: fetch,
    createVariant, updateVariant, removeVariant,
  }
}

export function usePublicProducts(categorySlug?: string) {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categorySlug) {
      q = q.eq('categories.slug', categorySlug)
    }

    q.then(({ data }) => {
      setProducts((data ?? []).map(sortVariants))
      setLoading(false)
    })
  }, [categorySlug])

  return { products, loading }
}
