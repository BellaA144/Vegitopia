'use server'

import { redirect } from 'next/navigation'

import { jwtDecode } from 'jwt-decode'

import { createClient } from './supabase/server'

export async function signOut() {
  const realm = process.env.KDEVSTREAM_ID_REALM_ID || ''
  const client = process.env.KDEVSTREAM_ID_CLIENT_ID || ''
  const clientSecret = process.env.KDEVSTREAM_ID_SECRET || ''
  const baseUrl = process.env.KDEVSTREAM_ID_URL || ''

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error !== null) {
      throw new Error('Error getting session. Sign out failed!')
    }

    await supabase.auth.signOut()

    const providerToken = data.session?.provider_token || ''
    const providerRefreshToken = data.session?.provider_refresh_token || ''

    if (providerToken && providerRefreshToken) {
      const logout_url = `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`

      const bodyApi: { [key: string]: string } = {
        client_id: client,
        client_secret: clientSecret,
        refresh_token: providerRefreshToken ? providerRefreshToken : ''
      }

      const encodedBody = Object.keys(bodyApi)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(bodyApi[key]))
        .join('&')

      await fetch(logout_url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + providerToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedBody
      })
    }

    return redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
