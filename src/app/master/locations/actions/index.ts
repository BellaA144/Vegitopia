'use server'

import { revalidatePath } from 'next/cache'

import type { LocationType } from '../types'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function getLocations(): Promise<LocationType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('locations')
      .select('id, name, address, city, state, zipCode, created_at')

    if (error) throw new Error(error.message)

    logger('getLocations', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getLocations', error, 'error')

    return []
  }
}

export async function addLocation(location: LocationType): Promise<LocationType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('locations').insert([location]).select().single()

    if (error) throw new Error(error.message)

    logger('addLocation', data, 'info')

    revalidatePath('/master/locations')

    return data
  } catch (error: any) {
    logger('addLocation', error, 'error')
    throw error
  }
}

export async function updateLocation(location: LocationType): Promise<LocationType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('locations')
      .update({
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode
      })
      .eq('id', location.id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    logger('updateLocation', data, 'info')

    revalidatePath('/master/locations')

    return data
  } catch (error: any) {
    logger('updateLocation', error, 'error')
    throw error
  }
}

export async function deleteLocations(locations: LocationType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('locations')
      .delete()
      .in(
        'id',
        locations.map(location => location.id)
      )

    if (error) throw new Error(error.message)

    logger('deleteLocations', data, 'info')

    revalidatePath('/master/locations')

    return true
  } catch (error: any) {
    logger('deleteLocations', error, 'error')
    throw error
  }
}
