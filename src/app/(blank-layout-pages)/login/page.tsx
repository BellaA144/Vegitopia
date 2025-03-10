// Next Imports
import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  const supabase = await createClient()

  const { data: userData, error } = await supabase.auth.getUser()

  logger('Auth Check', { user: userData?.user, error }, 'info')

  if (!error && userData?.user) {
    redirect('/')
  }

  return <Login />
}

export default LoginPage
