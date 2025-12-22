"use client"

import { useEffect, useState } from "react"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generateDiagnosisReport, type DiagnosisReport } from "@/app/actions/diagnosis"
import { useRouter } from "next/navigation"

interface DiagnosisReportProps {
  isDeepFocusMode: boolean
  onWeekChange?: (weekId: number) => void
}

export function DiagnosisReport({ isDeepFocusMode, onWeekChange }: DiagnosisReportProps) {
  const router = useRouter()
  const [report, setReport] = useState<DiagnosisReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await generateDiagnosisReport()
        if ("error" in result) {
          setError(result.error)
        } else {
          setReport(result)
        }
      } catch (err: any) {
        setError(err.message || "診断レポートの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  const handleGoToWeek1 = () => {
    // 親コンポーネントのonWeekChangeコールバックを使用してWeek 1に遷移
    if (onWeekChange) {
      onWeekChange(1)
    } else {
      // フォールバック: URLパラメータを使用
      router.push("/dashboard?week=1")
    }
  }

  if (loading) {
    return (
      <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-12 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">診断レポートを生成中...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("border-destructive/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            再試行
          </Button>
        </div>
      </Card>
    )
  }

  if (!report) {
    return null
  }

  return (
    <div className="relative min-h-screen">
      {/* グラデーション背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${report.color}40 0%, transparent 70%)`,
          }}
        />
      </div>

      <Card
        className={cn(
          "border-primary/20 bg-card/50 backdrop-blur-sm relative z-10",
          isDeepFocusMode && "bg-card/30"
        )}
      >
        <div className="p-8 md:p-12">
          {/* タイトル */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">生成AI活用診断結果</h1>
            </div>
            <p className="text-muted-foreground">あなたのAI活用タイプを分析しました</p>
          </div>

          {/* タイプ名とキャッチコピー */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-6 py-3 rounded-full mb-4 text-sm font-medium"
              style={{
                backgroundColor: `${report.color}20`,
                color: report.color,
                border: `1px solid ${report.color}40`,
              }}
            >
              {report.typeName}
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${report.color}, ${report.color}CC)`,
              }}
            >
              {report.catchphrase}
            </h2>
          </div>

          {/* 現状分析とアドバイス */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* 現状分析 */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: report.color }}
                />
                <h3 className="font-semibold text-foreground">現状分析</h3>
              </div>
              <p className="text-foreground/90 leading-relaxed">{report.analysis}</p>
            </Card>

            {/* アドバイス */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: report.color }}
                />
                <h3 className="font-semibold text-foreground">成長アドバイス</h3>
              </div>
              <p className="text-foreground/90 leading-relaxed">{report.advice}</p>
            </Card>
          </div>

          {/* タイプ別の詳細情報 */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${report.color}20`,
                  }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: report.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">このタイプについて</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.type === "efficiency_master" &&
                      "効率化マイスターは、AIを戦略的なツールとして活用し、既存のプロセスを体系的に改善します。Week 1の拡張案ジェネレーターで、業務課題を新しい視点から捉え直すことで、さらなる効率化のヒントが見つかります。"}
                    {report.type === "horizontal_dreamer" &&
                      "夢想する開拓者は、AIと共に未知の領域を探索し、創造的なアイデアを生み出します。Week 1の拡張案ジェネレーターで、異質な概念との出会いを通じて、あなたの創造性がさらに開花するでしょう。"}
                    {report.type === "cautious_learner" &&
                      "慎重な模索者は、段階的にAIを学びながら、着実にスキルを向上させます。Week 2の内省機能やWeek 3の言語化機能を活用することで、AIとの対話に自信を持てるようになります。"}
                    {report.type === "co_creator" &&
                      "共創する共犯者は、AIを相棒として捉え、対話を通じて共に創造します。Week 2の内省機能とWeek 3の言語化機能を組み合わせることで、AIとの深い対話が実現できます。"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA ボタン */}
          <div className="text-center">
            <Button
              onClick={handleGoToWeek1}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              学習の旅へ進む
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Week 1: 衝撃 - 思考の破壊</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

