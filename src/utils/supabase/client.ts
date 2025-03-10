import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_KDEVSTREAM_API_URL!,
    process.env.NEXT_PUBLIC_KDEVSTREAM_API_ANON_KEY!
  )
}
