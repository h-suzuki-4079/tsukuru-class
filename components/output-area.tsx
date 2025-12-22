"use client"

import { useState } from "react"
import { FileText, Save, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface OutputAreaProps {
  isDeepFocusMode: boolean
}

export function OutputArea({ isDeepFocusMode }: OutputAreaProps) {
  const [output, setOutput] = useState(
    "Week 1 の振り返り:\n\n私の思考の軸は「内省と成長」にあると気づきました。日々の小さな瞬間に意味を見出し、そこから学びを得ることを大切にしています...",
  )

  return (
    <Card className={cn("border-border transition-all", isDeepFocusMode && "border-border/50")}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isDeepFocusMode && <FileText className="w-5 h-5 text-primary" />}
            <h2 className={cn("font-semibold text-foreground", isDeepFocusMode ? "text-base" : "text-lg")}>
              思考のアウトプット（拡張案）
            </h2>
          </div>
          {!isDeepFocusMode && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1.5" />
                エクスポート
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-1.5" />
                保存
              </Button>
            </div>
          )}
        </div>

        {/* Output Editor */}
        <div className="space-y-4">
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className={cn(
              "font-mono text-sm bg-muted/30 border-border resize-none",
              isDeepFocusMode ? "min-h-[200px]" : "min-h-[300px]",
            )}
            placeholder="対話を通じて得た気づきや考えをここに記録してください..."
          />

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>最終更新: 2025年11月28日 15:45</div>
            <div>{output.length} 文字</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
