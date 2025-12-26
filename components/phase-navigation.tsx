"use client"

import { Lock, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const phases = [
  { id: 1, title: "Phase I: 自分の軸", status: "unlocked" as const },
  { id: 2, title: "Phase II: AIと伝える", status: "locked" as const },
  { id: 3, title: "Phase III: AIと考え抜く", status: "locked" as const },
  { id: 4, title: "Phase IV: 思考の拡張", status: "locked" as const },
  { id: 5, title: "Phase V: 実践", status: "locked" as const },
]

export function PhaseNavigation() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">Learning Journey</h1>
        <p className="text-sm text-muted-foreground mt-1">思考を変容させる旅路</p>
      </div>

      {/* Phase List */}
      <nav className="flex-1 p-4 space-y-2">
        {phases.map((phase) => (
          <button
            key={phase.id}
            className={cn(
              "w-full text-left p-4 rounded-lg transition-all duration-200",
              "border border-transparent",
              phase.status === "unlocked"
                ? "bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-primary/30"
                : "bg-sidebar-accent/50 opacity-60 cursor-not-allowed",
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5">
                {phase.status === "unlocked" ? (
                  <Circle className="w-5 h-5 text-sidebar-primary fill-sidebar-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      phase.status === "unlocked" ? "text-sidebar-foreground" : "text-muted-foreground",
                    )}
                  >
                    {phase.title}
                  </span>
                </div>

                {/* Progress bar for unlocked phase */}
                {phase.status === "unlocked" && (
                  <div className="mt-3">
                    <div className="h-1 bg-sidebar-border rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-sidebar-primary rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">33% 完了</p>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-sidebar-foreground mb-1">進行状況</p>
          <p>Phase I / 5</p>
        </div>
      </div>
    </div>
  )
}
