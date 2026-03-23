import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export async function signInWithGoogle() {
  const supabase = getSupabaseBrowserClient()
  const redirectTo = `${window.location.origin}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = getSupabaseBrowserClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export function onAuthChange(callback) {
  const supabase = getSupabaseBrowserClient()
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => callback(session)
  )
  return subscription
}
