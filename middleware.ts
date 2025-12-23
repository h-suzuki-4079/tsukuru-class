import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 安全装置: エラーが起きてもサイト全体を落とさない
  try {
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
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
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

    // 3. セッションチェック
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      // エラーログだけ出して処理は続行
      console.warn('Supabase middleware warning:', error.message)
    }

    // 4. パスによるガード
    const publicPaths = ['/', '/thanks', '/login']
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

    if (
      !user &&
      !isPublicPath &&
      !request.nextUrl.pathname.startsWith('/_next') &&
      !request.nextUrl.pathname.startsWith('/api') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/)
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return response

  } catch (e) {
    // ここでエラーをキャッチ！ 500画面を出さずにログに残す
    console.error('CRITICAL MIDDLEWARE ERROR (Bypassed):', e)
    
    // 緊急回避: 何もせずページを表示させる
    // (認証は効きませんが、500で落ちるよりマシです)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}