// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // --- ここから updateSession のロジック ---
  
  // 1. レスポンスの初期化
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase クライアント作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Request にセット
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          // Response を再生成（Request更新反映のため）
          response = NextResponse.next({
            request,
          })
          // Response にセット
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. セッションチェック
  // getUser は安全にセッション情報を取得します
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. パスによるガード
  const publicPaths = ['/', '/thanks', '/login']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // 未ログインかつ保護されたルートへのアクセス
  if (
    !user &&
    !isPublicPath &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/) // 静的ファイル除外の念押し
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

export const config = {
  matcher: [
    // Next.js の内部ファイルや静的アセットを除外
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}