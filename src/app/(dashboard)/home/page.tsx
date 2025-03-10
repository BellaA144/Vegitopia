import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { jwtDecode } from 'jwt-decode'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return <h1>Home page!</h1>
}
