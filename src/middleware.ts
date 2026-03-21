// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Supabase sozlanmagan bo'lsa, auth tekshirmasdan o'tkazib yuboramiz
  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your_')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Dashboard — login bo'lmasa /auth ga yo'naltir
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Onboarding — login bo'lmasa /auth ga
  if (pathname.startsWith('/onboarding') && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Login bo'lgan foydalanuvchi /auth ga kirsa — dashboard ga
  if (pathname === '/auth' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth'],
}
