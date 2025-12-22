"use client"

import { useState } from "react"
import { Send, Sparkles, ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { sendAdvisorMessage, type AdvisorMessage } from "@/app/actions/advisor-chat"

interface AiAdvisorProps {
  isOpen: boolean
  onToggle: () => void
}

export function AiAdvisor({ isOpen, onToggle }: AiAdvisorProps) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      role: "assistant",
      content: "こんにちは。あなたの思考の壁打ち相手です。対話を深めたい時、いつでもお声がけください。",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: AdvisorMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const result = await sendAdvisorMessage(input, messages)

      if ("error" in result) {
        setError(result.error)
        setMessages((prev) => prev.slice(0, -1)) // 最後のメッセージを削除
      } else {
        const assistantMessage: AdvisorMessage = {
          role: "assistant",
          content: result.message,
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

  return (
    <>
      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed right-6 top-6 z-50 rounded-full w-12 h-12 p-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-screen w-96 bg-card border-l border-border transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground font-sans">AIアドバイザー</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div key={idx} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm leading-relaxed font-serif",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground font-sans">入力中...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            {error && (
              <div className="mb-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
                    handleSend()
                  }
                }}
                placeholder="考えを共有する..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div onClick={onToggle} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" />}
    </>
  )
}
