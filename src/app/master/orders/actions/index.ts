'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { OrderType } from '../types'

export async function getOrders(): Promise<OrderType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getOrders', data, 'info')

    return data || []
  } catch (error) {
    logger('getOrders', error, 'error')

    return []
  }
}

export async function addOrder(order: OrderType) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('orders').insert([order]).select().single()

    if (error) throw new Error(error.message)

    logger('addOrder', data, 'info')
    revalidatePath('/master/orders')

    return data
  } catch (error) {
    logger('addOrder', error, 'error')

    return null
  }
}

export async function updateOrder(order: OrderType) {
  const supabase = await createClient()

  try {
    const { id, ...updateData } = order
    const { data, error } = await supabase.from('orders').update(updateData).eq('id', id).select().single()

    if (error) throw new Error(error.message)

    logger('updateOrder', data, 'info')
    revalidatePath('/master/orders')

    return data
  } catch (error) {
    logger('updateOrder', error, 'error')

    return null
  }
}

export async function deleteOrders(orders: OrderType[]) {
  const supabase = await createClient()

  try {
    const ids = orders.map(order => order.id)
    const { error } = await supabase.from('orders').delete().in('id', ids)

    if (error) throw new Error(error.message)

    logger('deleteOrders', { deletedIds: ids }, 'info')
    revalidatePath('/master/orders')

    return true
  } catch (error) {
    logger('deleteOrders', error, 'error')

    return false
  }
}
