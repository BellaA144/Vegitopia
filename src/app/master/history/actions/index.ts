'use server'

import { logger } from '@/utils/logger'
import { createClient } from '@/utils/supabase/server'

export default async function getTransactions() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, user_id(name), product_id(name)')
      .order('transaction_date', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getTransaction', data, 'info')

    return data || []
  } catch (error) {
    logger('getTransaction', error, 'error')

    return []
  }
}
