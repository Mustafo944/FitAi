import { createBrowserClient } from '@supabase/ssr'

let client = null

export function getSupabaseBrowserClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  client = createBrowserClient(supabaseUrl, supabaseKey)

  return client
}
