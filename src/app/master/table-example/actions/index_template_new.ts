'use server'

import { revalidatePath } from 'next/cache'

import type { ProductType } from '../types'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getProducts(): Promise<ProductType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').select('id, name, description, type, created_at')

    if (error) throw new Error(error.message)

    logger('getProducts', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getProducts', error, 'error')

    return []
  }
}

export async function addProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').insert([product]).select().single()

    if (error) throw new Error(error.message)

    logger('addProducts', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('addProduct', error, 'error')

    throw error
  }
}

export async function updateProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single()

    if (error) {
      throw new Error(error.message)
    }

    logger('updateProduct', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('updateProduct', error, 'error')

    throw error
  }
}

export async function deleteProducts(products: ProductType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .in(
        'id',
        products.map(product => product.id)
      )

    if (error) throw new Error(error.message)

    logger('deleteProduct', data, 'info')

    revalidatePath('/master/products')

    return true
  } catch (error: any) {
    logger('deleteProducts', error, 'error')

    throw error
  }
}
