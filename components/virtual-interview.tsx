"use client"

import { useState } from "react"
import { Send, Loader2, User, Bot, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  virtualInterview,
  generateValidationReport,
  type InterviewMessage,
  type ValidationReport,
} from "@/app/actions/virtual-interview"

interface VirtualInterviewProps {
  isDeepFocusMode: boolean
}

// プリセットペルソナ定義
const PERSONA_PRESETS = {
  investor: {
    name: "辛口な投資家",
    description: "厳しい目でビジネスを見る投資家",
    persona: "30代後半のベンチャーキャピタリスト。論理的で数字に厳しく、感情論を嫌う。常に市場優位性と収益性を問い詰めてくる。",
  },
  busy_mom: {
    name: "忙しい主婦",
    description: "時間とお金に敏感な主婦",
    persona: "小学生の子供2人を持つパート主婦。朝から晩まで時間がなく、とにかく「時短」と「コスパ」を最重視する。複雑な説明は読み飛ばす。",
  },
  gen_z_student: {
    name: "Z世代の学生",
    description: "デジタルネイティブな若者",
    persona: "デジタルネイティブな大学生。トレンドに敏感だが飽きっぽい。「タイパ（タイムパフォーマンス）」が悪いものは即座に見限る。",
  },
} as const

export function VirtualInterview({ isDeepFocusMode }: VirtualInterviewProps) {
  const [step, setStep] = useState<"persona" | "interview" | "report">("persona")
  const [persona, setPersona] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<ValidationReport | null>(null)

  const handlePresetSelect = (presetKey: keyof typeof PERSONA_PRESETS) => {
    const preset = PERSONA_PRESETS[presetKey]
    setPersona(preset.persona)
    setSelectedPreset(presetKey)
  }

  const handleStartInterview = () => {
    if (!persona.trim()) {
      setError("ペルソナ設定を入力してください")
      return
    }
    setError(null)
    setStep("interview")
    // 最初のメッセージを追加
    setMessages([
      {
        role: "assistant",
        content: "こんにちは。あなたのアイデアについて聞かせてください。",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) {
      return
    }

    const userMessage: InterviewMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setLoading(true)
    setError(null)

    try {
      const result = await virtualInterview(persona, currentMessage, [...messages, userMessage])

      if ("error" in result) {
        setError(result.error)
        setMessages((prev) => prev.slice(0, -1)) // 最後のメッセージを削除
      } else {
        const assistantMessage: InterviewMessage = {
          role: "assistant",
          content: result.message,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (err: any) {
      setError(err.message || "メッセージの送信に失敗しました")
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (messages.length === 0) {
      setError("会話履歴がありません")
      return
    }

    setReportLoading(true)
    setError(null)

    try {
      const result = await generateValidationReport(persona, messages)

      if ("error" in result) {
        setError(result.error)
      } else {
        setReport(result)
        setStep("report")
      }
    } catch (err: any) {
      setError(err.message || "レポートの生成に失敗しました")
    } finally {
      setReportLoading(false)
    }
  }

  const handleReset = () => {
    setStep("persona")
    setPersona("")
    setSelectedPreset(null)
    setMessages([])
    setCurrentMessage("")
    setReport(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Step 1: ペルソナ設定 */}
      {step === "persona" && (
        <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Step 1: ペルソナ設定</h2>
            <p className="text-sm text-muted-foreground mb-6">
              誰にアイデアを聞いてみますか？年齢、職業、性格、抱えている課題などを入力してください。
            </p>

            {/* プリセットボタン */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">プリセットから選択</label>
              <div className="grid md:grid-cols-3 gap-3">
                {Object.entries(PERSONA_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key as keyof typeof PERSONA_PRESETS)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      selectedPreset === key
                        ? "bg-primary/10 border-primary/40"
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <h4 className="font-semibold text-foreground mb-1">{preset.name}</h4>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* カスタム入力 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">カスタムペルソナ</label>
              <Textarea
                value={persona}
                onChange={(e) => {
                  setPersona(e.target.value)
                  setSelectedPreset(null)
                }}
                placeholder="例: 30代のフリーランスデザイナー。時間に余裕はないが、質の高いものに投資する価値観を持っている。..."
                className="min-h-[150px] bg-input border-border resize-none"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleStartInterview}
              disabled={!persona.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              インタビューを開始する
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: インタビューチャット */}
      {step === "interview" && (
        <div className="space-y-4">
          <Card className={cn("border-border bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">インタビュー中</h2>
                <Button onClick={handleReset} variant="outline" size="sm">
                  リセット
                </Button>
              </div>

              {/* チャットエリア */}
              <ScrollArea className="h-[400px] mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          msg.role === "user"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={cn(
                          "flex-1 p-4 rounded-lg",
                          msg.role === "user"
                            ? "bg-primary/10 text-foreground"
                            : "bg-card border border-border text-foreground"
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex-1 p-4 rounded-lg bg-card border border-border">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 入力エリア */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    // IME変換中は送信しない
                    if (e.nativeEvent.isComposing) {
                      return
                    }
                    // Shift + Enter は改行（送信しない）
                    if (e.key === "Enter" && e.shiftKey) {
                      return
                    }
                    // Enter のみ（かつ変換中でない）の場合のみ送信
                    if (e.key === "Enter" && !loading) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="アイデアや質問を入力..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !currentMessage.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* 終了ボタン */}
              <div className="mt-4 text-center">
                <Button
                  onClick={handleGenerateReport}
                  disabled={reportLoading || messages.length === 0}
                  variant="outline"
                >
                  {reportLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      レポート生成中...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      インタビューを終了して検証結果を見る
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3: 検証結果レポート */}
      {step === "report" && report && (
        <Card className={cn("border-primary/20 bg-card/50 backdrop-blur-sm", isDeepFocusMode && "bg-card/30")}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">検証結果レポート</h2>
            </div>

            {/* 刺さった点 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground">刺さった点</h3>
              </div>
              <div className="space-y-2">
                {report.strengths.map((strength, idx) => (
                  <Card key={idx} className="border-green-500/20 bg-green-500/5 p-4">
                    <p className="text-foreground/90">{strength}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* 懸念点 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground">懸念点</h3>
              </div>
              <div className="space-y-2">
                {report.concerns.map((concern, idx) => (
                  <Card key={idx} className="border-yellow-500/20 bg-yellow-500/5 p-4">
                    <p className="text-foreground/90">{concern}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* 総評 */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">総評</h3>
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm p-4">
                <p className="text-foreground/90 leading-relaxed">{report.summary}</p>
              </Card>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 justify-center">
              <Button onClick={handleReset} variant="outline">
                新しいインタビューを開始
              </Button>
              <Button
                onClick={() => setStep("interview")}
                variant="outline"
              >
                インタビューに戻る
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

