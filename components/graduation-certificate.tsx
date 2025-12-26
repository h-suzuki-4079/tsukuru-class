"use client"

import { useState, useEffect } from "react"
import { Trophy, Sparkles, Award, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getGraduationData, type GraduationData } from "@/app/actions/graduation"
import confetti from "canvas-confetti"

interface GraduationCertificateProps {
  isDeepFocusMode: boolean
}

export function GraduationCertificate({}: GraduationCertificateProps) {
  const [data, setData] = useState<GraduationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasReceived, setHasReceived] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getGraduationData()
        if ("error" in result) {
          setError(result.error)
        } else {
          setData(result)
        }
      } catch (err: any) {
        setError(err.message || "データの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReceive = () => {
    setHasReceived(true)

    // カラーパレット: ゴールド、白、Deep Slate
    const colors = ["#FFD700", "#FFFFFF", "#1e293b"]

    // 画面の両端から中央に向かって盛大にクラッカーを発射
    const fireConfetti = (originX: number, delay: number) => {
      setTimeout(() => {
        // 左端または右端から中央に向かって発射
        confetti({
          particleCount: 150,
          angle: originX === 0 ? 45 : 135, // 左端からは45度、右端からは135度
          spread: 60,
          origin: { x: originX, y: 0.5 },
          colors: colors,
          gravity: 0.8,
          drift: 0,
          ticks: 200,
          decay: 0.94,
        })

        // 追加の小さな発射（より広がりを持たせる）
        confetti({
          particleCount: 100,
          angle: originX === 0 ? 30 : 150,
          spread: 80,
          origin: { x: originX, y: 0.5 },
          colors: colors,
          gravity: 0.6,
          drift: 0,
          ticks: 250,
          decay: 0.92,
        })
      }, delay)
    }

    // 左端から数発発射（時間をずらして）
    fireConfetti(0, 0)
    fireConfetti(0, 200)
    fireConfetti(0, 400)

    // 右端から数発発射（時間をずらして）
    fireConfetti(1, 100)
    fireConfetti(1, 300)
    fireConfetti(1, 500)

    // 中央からも盛大に発射
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        gravity: 0.7,
        ticks: 300,
        decay: 0.95,
      })
    }, 600)

    // 追加のランダムな発射（祝砲効果）
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const randomX = Math.random()
        confetti({
          particleCount: 80,
          angle: randomX < 0.5 ? 45 + Math.random() * 45 : 135 - Math.random() * 45,
          spread: 50 + Math.random() * 30,
          origin: { x: randomX, y: 0.3 + Math.random() * 0.4 },
          colors: colors,
          gravity: 0.6 + Math.random() * 0.3,
          ticks: 200 + Math.random() * 100,
          decay: 0.92 + Math.random() * 0.03,
        })
      }, 800 + i * 300)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">修了証を準備しています...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-card/50 backdrop-blur-sm">
        <div className="p-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            再試行
          </Button>
        </div>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* 修了証カード */}
        <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl overflow-hidden">
          {/* ゴールドの装飾枠 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
          </div>

          <div className="p-12 md:p-16 relative">
            {/* タイトル */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Trophy className="w-12 h-12 text-yellow-500" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Certificate of Transformation
                </h1>
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
            </div>

            {/* 本文 */}
            <div className="text-center space-y-8 mb-12">
              <p className="text-lg text-muted-foreground italic">This is to certify that</p>

              <div className="py-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{data.userName}</h2>
                <div className="w-24 h-0.5 bg-yellow-500 mx-auto my-4" />
              </div>

              <p className="text-lg text-muted-foreground italic">has successfully completed the journey of</p>

              <div className="py-6">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-semibold text-yellow-500">{data.title}</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground italic">and has committed to</p>

              <div className="py-6">
                <p className="text-2xl md:text-3xl font-semibold text-foreground italic">{data.goal}</p>
              </div>
            </div>

            {/* 日付と署名 */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t border-yellow-500/20">
              <div className="text-center flex-1">
                <div className="w-32 h-0.5 bg-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-foreground font-medium mt-1">{data.date}</p>
              </div>

              <div className="flex items-center gap-2 text-yellow-500">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium">AI School</span>
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="text-center flex-1">
                <div className="w-32 h-0.5 bg-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Seal</p>
                <div className="mt-1">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* アクションボタン */}
        {!hasReceived && (
          <div className="text-center mt-8">
            <Button
              onClick={handleReceive}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 font-bold px-8 py-6 text-lg shadow-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              修了証を受け取る
            </Button>
          </div>
        )}

        {hasReceived && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <CheckCircle2 className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-medium">修了証を受け取りました！</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

