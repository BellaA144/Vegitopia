'use server'

// import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getCart() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('cart')
    .select(
      `
      cart_id,
      product_id,
      user_id,
      quantity,
      total_price,
      created_at,
      product:products(name, price, image_url)
    `
    )
    .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getCarts', data, 'info')

    return data || []

  } catch (error) {
    logger('getCarts', error, 'error')

    return []
  }
}
