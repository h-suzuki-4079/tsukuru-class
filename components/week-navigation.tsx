"use client"

import type React from "react"

import { Lock, Circle, Moon, Sparkles, Lightbulb, Target, FlaskConical, Zap, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Week {
  id: number
  title: string
  subtitle: string
  status: "unlocked" | "active" | "locked"
  icon: React.ElementType
  progress?: number
}

const weeks: Week[] = [
  { id: 0, title: "Week 0", subtitle: "事前準備", status: "unlocked", icon: Sparkles },
  { id: 1, title: "Week 1", subtitle: "衝撃 - 思考の破壊", status: "active", icon: Zap, progress: 33 },
  { id: 2, title: "Week 2", subtitle: "内省 - 自分の軸", status: "unlocked", icon: Circle },
  { id: 3, title: "Week 3", subtitle: "翻訳 - 言語化", status: "unlocked", icon: Lightbulb },
  { id: 4, title: "Week 4", subtitle: "深化 - 問いの設計", status: "unlocked", icon: Moon },
  { id: 5, title: "Week 5", subtitle: "検証 - 仮説づくり", status: "unlocked", icon: FlaskConical },
  { id: 6, title: "Week 6", subtitle: "結合 - アクション", status: "unlocked", icon: Target },
  { id: 7, title: "Week 7", subtitle: "実装 - Demo Day", status: "unlocked", icon: Trophy },
]

interface WeekNavigationProps {
  currentWeek?: number
  onWeekChange?: (weekId: number) => void
}

export function WeekNavigation({ currentWeek = 1, onWeekChange }: WeekNavigationProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground font-serif">Learning Journey</h1>
        <p className="text-sm text-muted-foreground mt-1 font-serif">思考を変容させる旅路</p>
      </div>

      {/* Week List */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {weeks.map((week) => {
          const Icon = week.icon
          const isSelected = week.id === currentWeek
          const isInteractive = week.status !== "locked"

          return (
            <button
              key={week.id}
              onClick={() => isInteractive && onWeekChange?.(week.id)}
              disabled={week.status === "locked"}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all duration-200 font-sans",
                "border",
                isSelected && week.status === "active"
                  ? "bg-sidebar-accent border-sidebar-primary/40 shadow-sm"
                  : week.status === "unlocked"
                    ? "bg-sidebar-accent/70 border-sidebar-primary/20 hover:bg-sidebar-accent hover:border-sidebar-primary/30"
                    : week.status === "active"
                      ? "bg-sidebar-accent border-sidebar-primary/30 hover:bg-sidebar-accent/90"
                      : "bg-sidebar-accent/30 border-transparent opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-0.5">
                  {week.status === "locked" ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        week.status === "active" ? "text-sidebar-primary" : "text-sidebar-foreground/70",
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        "text-xs font-medium uppercase tracking-wide font-sans",
                        week.status === "locked" ? "text-muted-foreground" : "text-sidebar-primary",
                      )}
                    >
                      {week.title}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium font-sans",
                        week.status === "locked" ? "text-muted-foreground" : "text-sidebar-foreground",
                      )}
                    >
                      {week.subtitle}
                    </span>
                  </div>

                  {/* Progress bar for active week */}
                  {week.status === "active" && week.progress !== undefined && (
                    <div className="mt-3">
                      <div className="h-1 bg-sidebar-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sidebar-primary rounded-full transition-all duration-300"
                          style={{ width: `${week.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-sans">{week.progress}% 完了</p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="text-sm text-muted-foreground font-sans">
          <p className="font-medium text-sidebar-foreground mb-1">進行状況</p>
          <p>Week {currentWeek} / 7</p>
        </div>
      </div>
    </div>
  )
}
