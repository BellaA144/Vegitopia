import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getLocations } from './actions'
import Locations from './components/Locations'

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const locations = await getLocations()

  return <Locations initialData={locations || []} />
}
