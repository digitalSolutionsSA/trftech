import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { DbProduct, DbProductInsert, DbProductUpdate, DbCategory } from '../types'

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
      .select('*, categories(id,name,slug)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (product: DbProductInsert) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select('*, categories(id,name,slug)')
      .single()
    if (error) throw error
    setProducts((prev) => [data, ...prev])
    return data
  }

  const update = async (id: string, product: DbProductUpdate) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select('*, categories(id,name,slug)')
      .single()
    if (error) throw error
    setProducts((prev) => prev.map((p) => (p.id === id ? data : p)))
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

  return { products, loading, error, create, update, remove, uploadImage, refetch: fetch }
}

export function usePublicProducts(categorySlug?: string) {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = supabase
      .from('products')
      .select('*, categories(id,name,slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categorySlug) {
      q = q.eq('categories.slug', categorySlug)
    }

    q.then(({ data }) => {
      setProducts(data ?? [])
      setLoading(false)
    })
  }, [categorySlug])

  return { products, loading }
}
