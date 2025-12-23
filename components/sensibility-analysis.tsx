"use client"

import { useState } from "react"
import { Sparkles, Loader2, Brain, Lightbulb, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { analyzeWeek2Logs, type Week2Analysis } from "@/app/actions/analyze-logs"

interface SensibilityAnalysisProps {
  isDeepFocusMode: boolean
}

export function SensibilityAnalysis({ isDeepFocusMode }: SensibilityAnalysisProps) {
  const [analysis, setAnalysis] = useState<Week2Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const result = await analyzeWeek2Logs()

      if ("error" in result) {
        setError(result.error)
      } else {
        setAnalysis(result)
      }
    } catch (err: any) {
      setError(err.message || "分析に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 分析ボタン */}
      {!analysis && !loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">価値観リフレクション</h3>
            <p className="text-sm text-muted-foreground mb-6">
              蓄積された内省ログをAIが分析し、あなたの価値観や無意識のブロックを言語化します。
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              今週の内省レポートを作成する
            </Button>
          </div>
        </Card>
      )}

      {/* ローディング */}
      {loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">AIがあなたの内省を深めています...</p>
            <p className="text-sm text-muted-foreground">少しお待ちください</p>
          </div>
        </Card>
      )}

      {/* エラー表示 */}
      {error && !loading && (
        <Card className={cn("border-destructive/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-destructive">エラー</h3>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={handleAnalyze}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              再試行
            </Button>
          </div>
        </Card>
      )}

      {/* 分析結果 */}
      {analysis && !loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6">
            {/* ヘッダー */}
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">内省レポート</h3>
            </div>

            {/* 核心的価値観 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">あなたの核心的価値観</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.core_values.map((value, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* 無意識のブロック */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold text-foreground">無意識のブロック</h4>
              </div>
              <Card className="border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-foreground/90 leading-relaxed">{analysis.hidden_block}</p>
              </Card>
            </div>

            {/* 週間サマリー */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">1週間の傾向</h4>
              </div>
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-4">
                <p className="text-foreground/90 leading-relaxed">{analysis.weekly_summary}</p>
              </Card>
            </div>

            {/* 再分析ボタン */}
            <div className="text-center">
              <Button
                onClick={handleAnalyze}
                variant="outline"
                size="sm"
              >
                再分析する
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}




