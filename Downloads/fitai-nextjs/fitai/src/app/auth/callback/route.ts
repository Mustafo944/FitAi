// src/app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorMsg = searchParams.get('error')
  const next = searchParams.get('next') ?? '/onboarding'

  // Agar darhol xato kelsa (masalan pikselli orqaga qaytish)
  if (errorMsg) {
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(errorMsg)}`)
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your_')) {
      return NextResponse.redirect(`${origin}/auth?error=missing_keys`)
    }

    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return response
    } else {
      console.error('Callback yozib olish xatosi:', error)
      return NextResponse.redirect(`${origin}/auth?error=exchange_failed`)
    }
  }

  // Xato bo'lsa yoki code yo'q bo'lsa auth ga xabar bilan qaytarish
  return NextResponse.redirect(`${origin}/auth?error=no_code`)
}
