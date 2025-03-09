import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getProducts } from './actions'
import Products from './components/Products'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const products = await getProducts()

  return <Products initialData={products || []} />
}
