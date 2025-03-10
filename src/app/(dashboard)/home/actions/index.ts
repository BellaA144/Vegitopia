'use server'

import { revalidatePath } from 'next/cache'

import type { ProductType } from '../types'
import { CartType } from '@/app/master/carts/types'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getProducts(): Promise<ProductType[]> {
  const supabase = await createClient()

  try {
    const { data: cartItems, error: cartError } = await supabase.from('carts').select('product_id')

    if (cartError) throw new Error(cartError.message)

    const cartProductIds = cartItems.map(item => item.product_id)

    let query = supabase.from('products').select('id, name, description, price, type, stock')

    if (cartProductIds.length > 0) {
      query = query.not('id', 'in', `(${cartProductIds.join(',')})`)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    logger('getProducts', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getProducts', error, 'error')

    return []
  }
}

export async function addToCart(cart: CartType): Promise<CartType | null> {
  const supabase = await createClient()
  const { product_id, quantity, stock, name, description } = cart

  try {
    const { error: validationError } = await supabase.rpc('validate_stock', {
      p_product_id: product_id,
      p_quantity: quantity
    })

    if (validationError) throw new Error(validationError.message)

    const { data, error } = await supabase
      .from('carts')
      .insert([
        {
          product_id,
          quantity,
          stock,
          name,
          description
        }
      ])
      .select('*')
      .single()

    if (error) throw new Error(error.message)

    logger('addToCart', data, 'info')

    revalidatePath('/home')
    revalidatePath('/master/carts')

    return data
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    throw new Error(error.message)
  }
}
