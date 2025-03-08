import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getPhones } from './actions'
import Phones from './components/Phones'

export default async function PhonesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const phones = await getPhones()

  return <Phones initialData={phones || []} />
}
