import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const errorMsg = url.searchParams.get('error')
  // Tilni ham olish (agar language sahifadan kelgan bo'lsa)
  const langParam = url.searchParams.get('lang') || request.cookies.get('lang')?.value
  const origin = url.origin

  // Xatolik xabarlari bilan yo'naltirish
  if (errorMsg) {
    const errUrl = request.nextUrl.clone()
    errUrl.pathname = '/auth'
    errUrl.search = `?error=${encodeURIComponent(errorMsg)}`
    return NextResponse.redirect(errUrl)
  }

  if (!code) {
    const noCodeUrl = request.nextUrl.clone()
    noCodeUrl.pathname = '/auth'
    noCodeUrl.search = '?error=no_code'
    return NextResponse.redirect(noCodeUrl)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your_')) {
    const keysUrl = request.nextUrl.clone()
    keysUrl.pathname = '/auth'
    keysUrl.search = '?error=missing_keys'
    return NextResponse.redirect(keysUrl)
  }

  // Avval supabase session oluvchi response yaratamiz
  const tempResponse = NextResponse.next()

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          tempResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error, data } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const exUrl = request.nextUrl.clone()
    exUrl.pathname = '/auth'
    exUrl.search = '?error=exchange_failed'
    return NextResponse.redirect(exUrl)
  }

  // User mavjudligini tekshirish va metadata bo'yicha yo'naltirish
  const user = data?.user
  const metadata = user?.user_metadata
  const hasAnalysis = metadata?.analysis || metadata?.dietPlan || metadata?.workoutPlan

  // To'g'ri redirect URL yaratish
  const finalUrl = request.nextUrl.clone()
  finalUrl.pathname = hasAnalysis ? '/dashboard' : '/onboarding'
  // Kodlarni tozalash
  finalUrl.searchParams.delete('code')
  
  const redirectResponse = NextResponse.redirect(finalUrl)

  // Supabase session cookie larini yangi redirect response ga ko'chirish
  for (const cookie of tempResponse.cookies.getAll()) {
    redirectResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path || '/',
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    })
  }

  // Til cookie sini o'rnatish (agar mavjud bo'lsa)
  if (langParam === 'uz' || langParam === 'ru') {
    redirectResponse.cookies.set('lang', langParam, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 yil
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  } else {
    // Agar langParam yo'q bo'lsa, default o'rnatamiz, loopni oldini olish uchun
    redirectResponse.cookies.set('lang', 'uz', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return redirectResponse
}