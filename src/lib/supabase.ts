// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Placeholder yoki bo'sh bo'lsa, mock client qaytaramiz
  if (!url || !key || url.startsWith('your_')) {
    return createMockClient()
  }

  client = createBrowserClient(url, key)
  return client
}

// Supabase sozlanmaganda xato bermasligi uchun mock client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockClient(): any {
  const noOp = () => ({ data: null, error: { message: 'Supabase sozlanmagan. .env.local faylini tekshiring.' } })
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => noOp(),
      signInWithPassword: async () => noOp(),
      signInWithOAuth: async () => noOp(),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  }
}
