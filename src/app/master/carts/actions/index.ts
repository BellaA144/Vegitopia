'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { logger } from "@/utils/logger"
import type { CartType } from "../types"

export async function fetchCarts(): Promise<CartType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('carts').select('*')

    if (error) throw new Error(error.message)

    logger('fetchCarts', data, 'info')

    return data || []
  } catch (error: any) {
    logger('fetchCarts', error, 'error')

    return []
  }
}

export async function updateCartQuantity(cart_id: string, quantity: number, total_price: number): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('carts')
      .update({ quantity, total_price })
      .eq('cart_id', cart_id)

    if (error) throw new Error(error.message)

    logger('updateCartQuantity', { cart_id, quantity, total_price }, 'info')

    revalidatePath('/master/cart')
    return true
  } catch (error: any) {
    logger('updateCartQuantity', error, 'error')

    return false
  }
}

export async function removeFromCart(cart_id: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('carts').delete().eq('cart_id', cart_id)

    if (error) throw new Error(error.message)

    logger('removeFromCart', { cart_id }, 'info')

    revalidatePath('/master/cart')
    return true
  } catch (error: any) {
    logger('removeFromCart', error, 'error')

    return false
  }
}
