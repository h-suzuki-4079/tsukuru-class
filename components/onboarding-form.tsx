"use client"

import { useState } from "react"
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { saveOnboardingAction, type OnboardingFormData } from "@/app/actions/onboarding"

// OnboardingFormData は app/actions/onboarding.ts からインポート

interface OnboardingFormProps {
  isDeepFocusMode: boolean
}

const USER_ROLES = [
  { value: "employee", label: "会社員" },
  { value: "freelancer", label: "フリーランス" },
  { value: "entrepreneur", label: "経営者" },
  { value: "student", label: "学生" },
  { value: "other", label: "その他" },
]

const AI_IMPRESSIONS = [
  { value: "unknown", label: "正直よくわからない" },
  { value: "useful", label: "便利そう" },
  { value: "partner", label: "相棒みたい" },
  { value: "threat", label: "脅威に感じる" },
  { value: "curious", label: "興味深い" },
]

const AI_USAGE_FREQUENCY = [
  { value: "never", label: "使ったことがない" },
  { value: "rarely", label: "たまに使う" },
  { value: "sometimes", label: "時々使う" },
  { value: "often", label: "よく使う" },
  { value: "daily", label: "毎日使う" },
]

const GOALS = [
  { value: "efficiency", label: "業務効率化" },
  { value: "planning", label: "企画作成" },
  { value: "communication", label: "発信力向上" },
  { value: "learning", label: "学習支援" },
  { value: "creativity", label: "創造性向上" },
  { value: "analysis", label: "分析・判断力向上" },
  { value: "other", label: "その他" },
]

const AI_SKILL_LEVEL = [
  { value: "beginner", label: "初心者" },
  { value: "intermediate", label: "中級者" },
  { value: "advanced", label: "上級者" },
]

const ACHIEVEMENT_STYLES = [
  { value: "short_focus", label: "短期集中型" },
  { value: "continuous", label: "継続習慣型" },
]

const REFLECTION_DEPTHS = [
  { value: "write_often", label: "よく書き出す" },
  { value: "struggle", label: "苦手" },
  { value: "dont_think", label: "考えない" },
]

const LEARNING_STYLES = [
  { value: "trial", label: "とりあえず触る" },
  { value: "manual", label: "マニュアル読む" },
  { value: "wait", label: "指示待ち" },
]

export function OnboardingForm({ isDeepFocusMode }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<OnboardingFormData>({
    user_role: "",
    ai_impression: "",
    ai_usage: "",
    ai_skill_level: "",
    goals: [],
    thinking_style: {
      achievement_style: "",
      reflection_depth: "",
      learning_style: "",
      ai_skill_level: "",
    },
  })

  const handleSubmit = async () => {
    // バリデーション
    if (!formData.user_role || !formData.ai_impression || !formData.ai_usage) {
      setError("すべての質問に回答してください")
      return
    }

    if (formData.goals.length === 0) {
      setError("実現したいことを1つ以上選択してください")
      return
    }

    if (
      !formData.thinking_style.achievement_style ||
      !formData.thinking_style.reflection_depth ||
      !formData.thinking_style.learning_style ||
      !formData.ai_skill_level
    ) {
      setError("すべての質問に回答してください")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await saveOnboardingAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // 保存成功後、ページをリロードして診断レポートを表示
        window.location.reload()
      }
    } catch (err: any) {
      setError(err.message || "保存に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.user_role || !formData.ai_impression) {
        setError("すべての質問に回答してください")
        return
      }
    } else     if (currentStep === 2) {
      if (!formData.ai_usage || formData.goals.length === 0 || !formData.ai_skill_level) {
        setError("すべての質問に回答してください")
        return
      }
    }
    setError(null)
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep(currentStep - 1)
  }

  const toggleGoal = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(value) ? prev.goals.filter((g) => g !== value) : [...prev.goals, value],
    }))
  }

  // completed状態は使わない（保存後にリロードするため）

  return (
    <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
      <div className="p-6">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {currentStep} / 3</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / 3) * 100)}% 完了
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Step 1: あなたについて */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Step 1: あなたについて</h2>
              <p className="text-sm text-muted-foreground mb-6">
                まずは、あなたの現在の状況を教えてください。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  現在の立場
                </label>
                <div className="space-y-2">
                  {USER_ROLES.map((role) => (
                    <label
                      key={role.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.user_role === role.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="user_role"
                        value={role.value}
                        checked={formData.user_role === role.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, user_role: e.target.value }))}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  AIへの現在の印象
                </label>
                <div className="space-y-2">
                  {AI_IMPRESSIONS.map((impression) => (
                    <label
                      key={impression.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.ai_impression === impression.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="ai_impression"
                        value={impression.value}
                        checked={formData.ai_impression === impression.value}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, ai_impression: e.target.value }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{impression.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AIとの関わり */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Step 2: AIとの関わり</h2>
              <p className="text-sm text-muted-foreground mb-6">
                AIとの関係性や、これから実現したいことを教えてください。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  現在の利用頻度
                </label>
                <div className="space-y-2">
                  {AI_USAGE_FREQUENCY.map((usage) => (
                    <label
                      key={usage.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.ai_usage === usage.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="ai_usage"
                        value={usage.value}
                        checked={formData.ai_usage === usage.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ai_usage: e.target.value }))}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{usage.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  今後実現したいこと（複数選択可）
                </label>
                <div className="space-y-2">
                  {GOALS.map((goal) => (
                    <label
                      key={goal.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.goals.includes(goal.value)
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal.value)}
                        onChange={() => toggleGoal(goal.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  自分のAIスキル感
                </label>
                <div className="space-y-2">
                  {AI_SKILL_LEVEL.map((level) => (
                    <label
                      key={level.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.ai_skill_level === level.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="ai_skill"
                        value={level.value}
                        checked={formData.ai_skill_level === level.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ai_skill_level: e.target.value,
                            thinking_style: { ...prev.thinking_style, ai_skill_level: e.target.value },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 思考のクセ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Step 3: 思考のクセ</h2>
              <p className="text-sm text-muted-foreground mb-6">
                あなたの思考パターンや学習スタイルを教えてください。これは重要です。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  何か目標を達成する時の傾向
                </label>
                <div className="space-y-2">
                  {ACHIEVEMENT_STYLES.map((style) => (
                    <label
                      key={style.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.thinking_style.achievement_style === style.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="achievement_style"
                        value={style.value}
                        checked={formData.thinking_style.achievement_style === style.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thinking_style: { ...prev.thinking_style, achievement_style: e.target.value },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{style.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  内省の深さ
                </label>
                <div className="space-y-2">
                  {REFLECTION_DEPTHS.map((depth) => (
                    <label
                      key={depth.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.thinking_style.reflection_depth === depth.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="reflection_depth"
                        value={depth.value}
                        checked={formData.thinking_style.reflection_depth === depth.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thinking_style: { ...prev.thinking_style, reflection_depth: e.target.value },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{depth.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  新しいツールの学び方
                </label>
                <div className="space-y-2">
                  {LEARNING_STYLES.map((style) => (
                    <label
                      key={style.value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        formData.thinking_style.learning_style === style.value
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="learning_style"
                        value={style.value}
                        checked={formData.thinking_style.learning_style === style.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thinking_style: { ...prev.thinking_style, learning_style: e.target.value },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{style.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              次へ
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "保存中..." : "診断結果を送信してスタートする"}
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

