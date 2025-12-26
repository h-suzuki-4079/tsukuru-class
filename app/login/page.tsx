"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // メール認証リンクを踏んだ後に戻す先（本番なら https://tsukuru-class-h18j.vercel.app/login）
            emailRedirectTo: `${location.origin}/login`,
          },
        })
        if (signUpError) throw signUpError

        // ※メール認証が必要な設定の場合、ここで即 /dashboard に飛ばすと未認証で弾かれることがあるため、
        // まずは /login に留めて「メールを確認してください」導線にするのが安全です。
        router.push("/login")
        router.refresh()
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        // ログイン成功後、ダッシュボードへ
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {isSignUp ? "アカウント作成" : "ログイン"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "新しいアカウントを作成して始めましょう"
                : "AI思考変容スクールへようこそ"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "処理中..." : isSignUp ? "サインアップ" : "ログイン"}
            </Button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? (
                <>
                  既にアカウントをお持ちですか？{" "}
                  <span className="font-medium text-primary">ログイン</span>
                </>
              ) : (
                <>
                  アカウントをお持ちでない方は{" "}
                  <span className="font-medium text-primary">サインアップ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
