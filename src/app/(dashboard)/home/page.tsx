import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import Hero from '@/components/Hero'
import { getProducts } from './actions'
import Products from './components/Products'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const products = await getProducts()

  return (
    <div className='overflow-hidden'>
      <Hero />
      <Products initialData={products || []} />
    </div>
  )
}
