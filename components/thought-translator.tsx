"use client"

import { useState } from "react"
import { Sparkles, Loader2, FileText, BookOpen, Lightbulb, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { translateThought, type Framework } from "@/app/actions/translate-thought"

interface ThoughtTranslatorProps {
  isDeepFocusMode: boolean
}

const FRAMEWORKS: { value: Framework; name: string; description: string; icon: React.ElementType }[] = [
  {
    value: "prep",
    name: "PREP法 (論理)",
    description: "結論→理由→具体例→結論。ビジネス向けの論理的な説明",
    icon: FileText,
  },
  {
    value: "storytelling",
    name: "ストーリーテリング (共感)",
    description: "ヒーローズ・ジャーニーに基づく物語形式で、共感を生む表現",
    icon: BookOpen,
  },
  {
    value: "metaphor",
    name: "メタファー (比喩)",
    description: "複雑な概念を「何かに例えて」わかりやすく解説",
    icon: Lightbulb,
  },
]

export function ThoughtTranslator({ isDeepFocusMode }: ThoughtTranslatorProps) {
  const [input, setInput] = useState("")
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null)
  const [translated, setTranslated] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!input.trim()) {
      setError("言語化したいアイデアや思いを入力してください")
      return
    }

    if (!selectedFramework) {
      setError("フレームワークを選択してください")
      return
    }

    setLoading(true)
    setError(null)
    setTranslated(null)

    try {
      const result = await translateThought(input, selectedFramework)

      if ("error" in result) {
        setError(result.error)
      } else {
        setTranslated(result.translated)
      }
    } catch (err: any) {
      setError(err.message || "変換に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 入力エリア */}
      <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">言語化したいアイデアや思い</h2>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="頭の中にある雑多な思考やアイデアを、そのまま書いてください..."
            className="min-h-[200px] bg-input border-border resize-none mb-4"
            disabled={loading}
          />

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 変換ボタン */}
          <Button
            onClick={handleTranslate}
            disabled={loading || !input.trim() || !selectedFramework}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                思考を翻訳中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                思考を翻訳する
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* フレームワーク選択 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">思考フレームワークを選択</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {FRAMEWORKS.map((framework) => {
            const Icon = framework.icon
            const isSelected = selectedFramework === framework.value

            return (
              <button
                key={framework.value}
                onClick={() => setSelectedFramework(framework.value)}
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
                  <h4 className="font-semibold text-foreground">{framework.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{framework.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 出力エリア */}
      {translated && !loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">翻訳された思考</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">{translated}</pre>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(translated)
                }}
              >
                コピー
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("")
                  setTranslated(null)
                  setSelectedFramework(null)
                }}
              >
                クリア
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ローディング表示 */}
      {loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">思考を翻訳しています...</p>
            <p className="text-sm text-muted-foreground">選択したフレームワークに従って変換中です</p>
          </div>
        </Card>
      )}
    </div>
  )
}



