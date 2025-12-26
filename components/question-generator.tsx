"use client"

import { useState } from "react"
import { Sparkles, Loader2, HelpCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { generateQuestions, type Perspective } from "@/app/actions/generate-questions"

interface QuestionGeneratorProps {
  isDeepFocusMode: boolean
}

const PERSPECTIVES: { value: Perspective; name: string; description: string; icon: React.ElementType }[] = [
  {
    value: "why",
    name: "本質追求 (Why?)",
    description: "「なぜ？」を繰り返して深堀りする",
    icon: HelpCircle,
  },
  {
    value: "critical",
    name: "悪魔の代弁者 (Critical)",
    description: "あえて反対意見や盲点を突く",
    icon: AlertCircle,
  },
  {
    value: "reframing",
    name: "視点移動 (Reframing)",
    description: "「もしあなたがドラえもんだったら？」「100年後の未来なら？」など視点をズラす",
    icon: RefreshCw,
  },
]

export function QuestionGenerator({ isDeepFocusMode }: QuestionGeneratorProps) {
  const [concern, setConcern] = useState("")
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!concern.trim()) {
      setError("悩みや行き詰まっていることを入力してください")
      return
    }

    if (!selectedPerspective) {
      setError("視点を選択してください")
      return
    }

    setLoading(true)
    setError(null)
    setQuestions([])

    try {
      const result = await generateQuestions(concern, selectedPerspective)

      if ("error" in result) {
        setError(result.error)
      } else {
        setQuestions(result.questions)
      }
    } catch (err: any) {
      setError(err.message || "問いの生成に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 悩み入力エリア */}
      <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            今、行き詰まっていること・解決したいこと
          </h2>
          <Textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="あなたの悩みや課題を自由に書いてください..."
            className="min-h-[200px] bg-input border-border resize-none mb-4"
            disabled={loading}
          />

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 生成ボタン */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !concern.trim() || !selectedPerspective}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                問いを生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                問いを立てる
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 視点切替スイッチ */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">視点を選択</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PERSPECTIVES.map((perspective) => {
            const Icon = perspective.icon
            const isSelected = selectedPerspective === perspective.value

            return (
              <button
                key={perspective.value}
                onClick={() => setSelectedPerspective(perspective.value)}
                disabled={loading}
                className={cn(
                  "p-6 rounded-lg border transition-all text-left",
                  "hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                  isSelected
                    ? "bg-primary/10 border-primary/40 shadow-sm"
                    : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-foreground">{perspective.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{perspective.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 結果表示 */}
      {questions.length > 0 && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">生成された問い</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {questions.map((question, index) => (
              <Card
                key={index}
                className={cn(
                  "border-primary/20 bg-card/50 backdrop-blur-sm p-6",
                  isDeepFocusMode && "bg-card/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-foreground leading-relaxed flex-1">{question}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConcern("")
                setQuestions([])
                setSelectedPerspective(null)
              }}
            >
              クリア
            </Button>
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">思考を深める問いを生成しています...</p>
            <p className="text-sm text-muted-foreground">ソクラテスのように、本質を突く問いを考えています</p>
          </div>
        </Card>
      )}
    </div>
  )
}





