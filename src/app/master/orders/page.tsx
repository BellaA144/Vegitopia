import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getOrders } from './actions'
import Orders from './components/Orders'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const orders = await getOrders()

  return <Orders initialData={orders || []} />
}
