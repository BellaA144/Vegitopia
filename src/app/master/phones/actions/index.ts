'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

import type { PhoneType } from '../types'

export async function getPhones(): Promise<PhoneType[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('phones').select('*')

  if (error) {
    logger('getPhones', error.message, 'error')
    throw new Error(error.message)
  }

  logger('getPhones', data, 'info')

  return data || []
}

export async function addPhone(phone: PhoneType): Promise<PhoneType | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('phones').insert([phone]).select().single()

  if (error) {
    logger('addPhone', error.message, 'error')
    throw new Error(error.message)
  }

  logger('addPhone', data, 'info')
  revalidatePath('/master/phones')

  return data
}

export async function updatePhone(phone: PhoneType): Promise<PhoneType | null> {
  if (!phone.id) throw new Error('Phone ID is required for updating.')

  const supabase = await createClient()
  const { data, error } = await supabase.from('phones').update(phone).match({ id: phone.id }).select().single()

  if (error) {
    logger('updatePhone', error.message, 'error')
    throw new Error(error.message)
  }

  logger('updatePhone', data, 'info')
  revalidatePath('/master/phones')

  return data
}

export async function deletePhones(phones: PhoneType[]): Promise<boolean> {
  const supabase = await createClient()
  const idsToDelete = phones.map(phone => phone.id).filter(Boolean)

  if (!idsToDelete.length) throw new Error('No valid phone IDs provided for deletion.')

  const { error } = await supabase.from('phones').delete().in('id', idsToDelete)

  if (error) {
    logger('deletePhones', error.message, 'error')
    throw new Error(error.message)
  }

  logger('deletePhones', idsToDelete, 'info')
  revalidatePath('/master/phones')

  return true
}
