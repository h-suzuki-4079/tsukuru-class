"use client"

import { useState } from "react"
import { MessageSquare, Plus, User, Bot } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const mockDialogues = [
  {
    id: 1,
    title: "対話セッション #1",
    date: "2025年11月28日 14:30",
    exchanges: [
      { role: "user", content: "自分の価値観について考えたいです。どこから始めればいいでしょうか?" },
      {
        role: "ai",
        content:
          "まず、あなたが日常で大切にしている瞬間を3つ思い浮かべてください。それらに共通するテーマは何でしょうか?",
      },
      {
        role: "user",
        content:
          "朝のコーヒーを飲む時間、友人との深い会話、新しいことを学ぶ瞬間...共通点は「内省と成長」かもしれません。",
      },
    ],
  },
  {
    id: 2,
    title: "対話セッション #2",
    date: "2025年11月27日 10:15",
    exchanges: [
      { role: "user", content: "昨日の対話を振り返って、もっと深掘りしたいです。" },
      {
        role: "ai",
        content: "素晴らしいですね。「内省と成長」というテーマについて、具体的にどのような行動に現れていますか?",
      },
    ],
  },
]

interface DialogueLogProps {
  isDeepFocusMode: boolean
}

export function DialogueLog({ isDeepFocusMode }: DialogueLogProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1)

  return (
    <Card className={cn("border-border transition-all", isDeepFocusMode && "border-border/50")}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isDeepFocusMode && <MessageSquare className="w-5 h-5 text-primary" />}
            <h2 className={cn("font-semibold text-foreground", isDeepFocusMode ? "text-base" : "text-lg")}>
              AIとの対話ログ
            </h2>
          </div>
          {!isDeepFocusMode && (
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1.5" />
              新しい対話
            </Button>
          )}
        </div>

        {/* Dialogue List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {mockDialogues.map((dialogue) => (
              <div key={dialogue.id} className="border border-border rounded-lg overflow-hidden transition-all">
                {/* Dialogue Header */}
                <button
                  onClick={() => setExpandedId(expandedId === dialogue.id ? null : dialogue.id)}
                  className="w-full p-4 bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{dialogue.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{dialogue.date}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{dialogue.exchanges.length} メッセージ</div>
                  </div>
                </button>

                {/* Dialogue Content */}
                {expandedId === dialogue.id && (
                  <div className="p-4 bg-muted/30 border-t border-border space-y-3">
                    {dialogue.exchanges.map((exchange, idx) => (
                      <div key={idx} className={`flex gap-3 ${exchange.role === "user" ? "flex-row-reverse" : ""}`}>
                        {!isDeepFocusMode && (
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              exchange.role === "user"
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {exchange.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                        )}
                        <div
                          className={`flex-1 p-3 rounded-lg text-sm leading-relaxed ${
                            exchange.role === "user" ? "bg-primary/10 text-foreground" : "bg-card text-foreground/90"
                          }`}
                        >
                          {exchange.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
