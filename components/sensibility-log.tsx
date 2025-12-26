"use client"

import { useState, useEffect, useTransition } from "react"
import { Send, Trash2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { postLog, getLogs, deleteLog, type SensibilityLog, type Emotion } from "@/app/actions/sensibility-logs"
import { SensibilityAnalysis } from "@/components/sensibility-analysis"
import { format } from "date-fns"

interface SensibilityLogProps {
  isDeepFocusMode: boolean
}

const EMOTIONS: { value: Emotion; icon: string; label: string; color: string }[] = [
  { value: "joy", icon: "☀️", label: "喜び", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-500" },
  { value: "anger", icon: "🔥", label: "怒り", color: "bg-red-500/20 border-red-500/40 text-red-500" },
  { value: "sadness", icon: "💧", label: "悲しみ", color: "bg-blue-500/20 border-blue-500/40 text-blue-500" },
  { value: "fun", icon: "🌱", label: "楽しみ", color: "bg-green-500/20 border-green-500/40 text-green-500" },
  { value: "insight", icon: "💡", label: "気づき", color: "bg-purple-500/20 border-purple-500/40 text-purple-500" },
]

export function SensibilityLogComponent({ isDeepFocusMode }: SensibilityLogProps) {
  const [content, setContent] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [logs, setLogs] = useState<SensibilityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // ログを取得
  const fetchLogs = async () => {
    try {
      setLoading(true)
      const result = await getLogs()
      if ("error" in result) {
        setError(result.error)
      } else {
        setLogs(result)
        setError(null)
      }
    } catch (err: any) {
      setError(err.message || "ログの取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // 投稿処理
  const handlePost = async () => {
    if (!content.trim()) {
      setError("投稿内容を入力してください")
      return
    }

    if (!selectedEmotion) {
      setError("感情を選択してください")
      return
    }

    setPosting(true)
    setError(null)

    try {
      const result = await postLog(content, selectedEmotion)

      if (result.error) {
        setError(result.error)
      } else {
        // 成功時: フォームをリセット
        setContent("")
        setSelectedEmotion(null)
        
        // タイムラインを更新（revalidatePathにより自動更新されるが、手動でも更新）
        startTransition(() => {
          fetchLogs()
        })
      }
    } catch (err: any) {
      setError(err.message || "投稿に失敗しました")
    } finally {
      setPosting(false)
    }
  }

  // 削除処理
  const handleDelete = async (logId: string) => {
    if (!confirm("このログを削除しますか？")) {
      return
    }

    try {
      const result = await deleteLog(logId)

      if (result.error) {
        setError(result.error)
      } else {
        // タイムラインを更新
        startTransition(() => {
          fetchLogs()
        })
      }
    } catch (err: any) {
      setError(err.message || "削除に失敗しました")
    }
  }

  return (
    <div className="space-y-6">
      {/* 価値観リフレクション分析 */}
      <SensibilityAnalysis isDeepFocusMode={isDeepFocusMode} />

      {/* 投稿エリアとタイムライン */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 左側: 投稿エリア */}
        <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">内省を記録する</h2>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* テキストエリア */}
          <div className="mb-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今の気持ちや気づきを自由に書いてください..."
              className="min-h-[200px] bg-input border-border resize-none"
              disabled={posting}
            />
          </div>

          {/* 感情選択ボタン */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-2 block">感情を選択</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.value}
                  onClick={() => setSelectedEmotion(emotion.value)}
                  disabled={posting}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                    "hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedEmotion === emotion.value
                      ? emotion.color + " border-2 font-medium"
                      : "bg-card border-border hover:bg-muted/50"
                  )}
                >
                  <span className="text-xl">{emotion.icon}</span>
                  <span className="text-sm text-foreground">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 投稿ボタン */}
          <Button
            onClick={handlePost}
            disabled={posting || !content.trim() || !selectedEmotion}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                投稿中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                投稿する
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 右側: タイムライン */}
      <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">タイムライン</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>まだ投稿がありません。</p>
              <p className="text-sm mt-2">左側のフォームから内省を記録してみましょう。</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {logs.map((log) => {
                const emotion = EMOTIONS.find((e) => e.value === log.emotion)
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emotion?.icon}</span>
                        <span className="text-sm font-medium text-foreground">{emotion?.label}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-foreground/90 leading-relaxed mb-2 whitespace-pre-wrap">{log.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), "yyyy年MM月dd日 HH:mm")}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
      </div>
    </div>
  )
}

