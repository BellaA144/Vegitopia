'use server'

// import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getCart() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('cart').select('*').order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getCarts', data, 'info')

    return data || []

  } catch (error) {
    logger('getCarts', error, 'error')

    return []
  }
}
