"use client"

import { useState } from "react"
import { Sparkles, Loader2, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { generateIdeaAction } from "@/app/actions/generate-idea"

interface IdeaGeneratorProps {
  isDeepFocusMode: boolean
}

export function IdeaGenerator({ isDeepFocusMode }: IdeaGeneratorProps) {
  const [businessChallenge, setBusinessChallenge] = useState("")
  const [generatedIdea, setGeneratedIdea] = useState<string | null>(null)
  const [noiseElement, setNoiseElement] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!businessChallenge.trim()) {
      setError("ビジネス課題を入力してください")
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedIdea(null)
    setNoiseElement(null)

    try {
      const result = await generateIdeaAction(businessChallenge)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setGeneratedIdea(result.idea || null)
        setNoiseElement(result.noiseElement || null)
      }
    } catch (err: any) {
      setError(err.message || "拡張案の生成に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("border-border transition-all", isDeepFocusMode && "border-border/50")}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isDeepFocusMode && <Sparkles className="w-5 h-5 text-primary" />}
            <h2 className={cn("font-semibold text-foreground", isDeepFocusMode ? "text-base" : "text-lg")}>
              拡張案ジェネレーター
            </h2>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="challenge" className="text-sm font-medium text-foreground">
              ビジネス課題を入力してください
            </label>
            <Textarea
              id="challenge"
              value={businessChallenge}
              onChange={(e) => setBusinessChallenge(e.target.value)}
              placeholder="例: 顧客のエンゲージメントを向上させたい"
              className="min-h-[100px] bg-input border-border resize-none"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !businessChallenge.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                拡張案を生成中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                拡張案を生成
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Generated Idea Display */}
        {generatedIdea && (
          <div className="space-y-4">
            {noiseElement && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">使用されたノイズ要素</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{noiseElement}</p>
              </div>
            )}

            <div className="rounded-lg bg-muted/30 border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">生成された拡張案</span>
              </div>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                    {generatedIdea}
                  </pre>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!generatedIdea && !loading && (
          <div className="mt-6 rounded-lg bg-muted/30 border border-border p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">使い方:</strong>
              <br />
              1. 上記のテキストエリアに、解決したいビジネス課題を入力してください。
              <br />
              2. 「拡張案を生成」ボタンをクリックすると、ランダムなノイズ要素と組み合わせて、創造的な拡張案が生成されます。
              <br />
              3. 生成された拡張案は自動的に保存され、後から確認できます。
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}


