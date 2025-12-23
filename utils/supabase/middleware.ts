// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. レスポンスの初期化（ここでは request はまだ変更しない）
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 2. 重要: Request と Response の両方に Cookie をセットする
          // これがないと、Server Component 側で最新のセッションが即座に反映されません
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          
          // Request を更新した状態でもう一度 Response を作り直す
          response = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. getUser でセッションを取得（auth.guard の役割）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. ルーティングガード（matcher と併用推奨）
  const publicPaths = ['/', '/thanks', '/login']
  // _next や api, static などの除外は middleware.ts の matcher でやるのが基本ですが、
  // ここでも念の為チェックするのは安全です
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (
    !user &&
    !isPublicPath &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/auth') // auth callback用
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ログイン済みユーザーが /login に来た場合
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}