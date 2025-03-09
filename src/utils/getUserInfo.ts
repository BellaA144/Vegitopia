'use server'

import { createClient } from './supabase/server'

export async function getUserInfo() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (!data?.user || error) {
      throw new Error(`Invalid user: ${error}`)
    }

    return {
      user_id: data.user?.id || '',
      email: data.user?.email || '',
      name: data.user?.user_metadata.name || ''
    }
  } catch (error) {
    console.error('Error getting user: ', error)
  }
}
