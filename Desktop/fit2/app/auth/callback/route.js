import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Profil borligini tekshirish
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarded')
          .eq('id', user.id)
          .single()

        // Agar profil bo'lsa va onboarded = true bo'lsa, dashboard ga yo'naltirish
        if (profile?.onboarded) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Xatolik bo'lsa bosh sahifaga qaytarish
  return NextResponse.redirect(new URL('/', request.url))
}
