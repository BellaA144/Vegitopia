import React from 'react'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import { getTransactions} from './actions'
import Transactions from './components/transactions'

export default async function Historypage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const history = await getTransactions()

  console.log('History:', history)

  return <Transactions initialData={history || []} />
}
