"use client"

import { useState } from "react"
import { Target, Loader2, Calendar, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { generateRoadmap, type TimelinePeriod, type RoadmapPhase } from "@/app/actions/generate-roadmap"

interface ActionRoadmapProps {
  isDeepFocusMode: boolean
}

const PERIOD_OPTIONS: { value: TimelinePeriod; label: string; description: string }[] = [
  {
    value: "1month",
    label: "1ヶ月",
    description: "短期集中型",
  },
  {
    value: "3months",
    label: "3ヶ月",
    description: "中期的な計画",
  },
  {
    value: "6months",
    label: "6ヶ月",
    description: "長期的な戦略",
  },
]

export function ActionRoadmap({ isDeepFocusMode }: ActionRoadmapProps) {
  const [goal, setGoal] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<TimelinePeriod | null>(null)
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("目標を入力してください")
      return
    }

    if (!selectedPeriod) {
      setError("期間を選択してください")
      return
    }

    setLoading(true)
    setError(null)
    setPhases([])

    try {
      const result = await generateRoadmap(goal, selectedPeriod)

      if ("error" in result) {
        setError(result.error)
      } else {
        setPhases(result.phases)
      }
    } catch (err: any) {
      setError(err.message || "ロードマップの生成に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 目標入力エリア */}
      <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            あなたが実現したいプロジェクトや目標
          </h2>
          <Textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="例: オンラインスクールの立ち上げ、新しいスキルの習得、副業の開始など..."
            className="min-h-[150px] bg-input border-border resize-none mb-4"
            disabled={loading}
          />

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 期間選択 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              期間設定
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {PERIOD_OPTIONS.map((option) => {
                const isSelected = selectedPeriod === option.value

                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedPeriod(option.value)}
                    disabled={loading}
                    className={cn(
                      "p-4 rounded-lg border transition-all text-left",
                      "hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 生成ボタン */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !goal.trim() || !selectedPeriod}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                アクションプランを生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                アクションプランを作成する
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* ローディング表示 */}
      {loading && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">アクションプランを生成しています...</p>
            <p className="text-sm text-muted-foreground">目標を具体的なタスクに分解しています</p>
          </div>
        </Card>
      )}

      {/* ロードマップ表示 */}
      {phases.length > 0 && !loading && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">生成されたロードマップ</h3>
          <div className="space-y-6">
            {phases.map((phase, phaseIndex) => (
              <Card
                key={phaseIndex}
                className={cn(
                  "border-primary/20 bg-card/50 backdrop-blur-sm",
                  isDeepFocusMode && "bg-card/30"
                )}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {phaseIndex + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{phase.title}</h4>
                  </div>

                  {/* タスクリスト */}
                  <div className="space-y-3">
                    {phase.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-foreground leading-relaxed flex-1">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* クリアボタン */}
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGoal("")
                setPhases([])
                setSelectedPeriod(null)
                setError(null)
              }}
            >
              クリア
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}





