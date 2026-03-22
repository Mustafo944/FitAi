// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const { pathname } = request.nextUrl

  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your_')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth callback ni hech qachon to'smaymiz — bu route o'zi boshqaradi
  if (pathname.startsWith('/auth/callback')) {
    return response
  }

  const safeRedirect = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      })
    })
    return redirectResponse
  }

  // Til tanlanganmi tekshirish (cookie dan)
  const langCookie = request.cookies.get('lang')?.value
  const hasSelectedLang = langCookie === 'uz' || langCookie === 'ru'

  // Login qilmagan user protected sahifalarga kira olmaydi
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
    return safeRedirect('/auth')
  }

  // Login qilgan user auth sahifaga kirmaydi
  if (user && pathname === '/auth') {
    return safeRedirect('/dashboard')
  }

  // Login qilgan user language va landing sahifani ko'rmaydi
  if (user && (pathname === '/language' || pathname === '/landing')) {
    return safeRedirect('/dashboard')
  }

  // Til tanlanmagan bo'lsa va user login qilmagan bo'lsa - language sahifaga
  // Lekin /landing, /auth va / ga ruxsat beramiz
  if (!user && !hasSelectedLang && pathname !== '/language' && pathname !== '/landing' && pathname !== '/' && pathname !== '/auth') {
    return safeRedirect('/language')
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth/:path*', '/language', '/landing', '/'],
}