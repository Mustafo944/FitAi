import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const errorMsg = url.searchParams.get('error')
  const origin = url.origin

  if (errorMsg) {
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(errorMsg)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your_')) {
    return NextResponse.redirect(`${origin}/auth?error=missing_keys`)
  }

  // Cookie-larni to'g'ri o'rnatish uchun avval NextResponse.next() yasaymiz
  const response = NextResponse.next()

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

  const { error, data } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth?error=exchange_failed`)
  }

  const hasAnalysis = !!(data?.user?.user_metadata?.analysis)
  const destination = hasAnalysis ? '/dashboard' : '/onboarding'

  // HTML page qaytaramiz — bu cookie-lar browser-ga yozilishini kafolatlaydi
  // Keyin JS orqali redirect qilamiz (race condition yo'q)
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kirish...</title>
  <style>
    body { margin: 0; background: #0a0a0a; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #c8f55a; animation: pulse 1s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  </style>
</head>
<body>
  <div class="dot"></div>
  <script>
    // Cookie-lar yozilishi uchun bir tick kutamiz
    setTimeout(function() { window.location.replace("${destination}"); }, 100)
  </script>
</body>
</html>`

  const htmlResponse = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })

  // Cookie-larni HTML response ga ko'chiramiz
  for (const cookie of response.cookies.getAll()) {
    htmlResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path || '/',
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    })
  }

  return htmlResponse
}