'use server'

import { logger } from '@/utils/logger'
import { createClient } from '@/utils/supabase/server'

export async function getTransactions() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, product_id(name, description)')
      .order('transaction_date', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getTransaction', data, 'info')

    return data || []
  } catch (error) {
    logger('getTransaction', error, 'error')

    return []
  }
}

export async function deleteAllTransactions() {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions') // Replace with your actual table name
    .delete()
    .neq('transaction_id', '00000000-0000-0000-0000-000000000000') // Delete all rows (ensures all IDs are deleted)

  if (error) {
    throw new Error(error.message)

    return false
  }

  return true
}
