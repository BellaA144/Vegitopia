'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signInWithDevStreamId() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
      redirectTo: process.env.REDIRECT_URI_CALLBACK
    }
  })

  if (data.url) {
    return redirect(data.url)
  }
}
