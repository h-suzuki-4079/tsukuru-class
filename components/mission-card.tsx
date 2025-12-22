"use client"

import { Target, Calendar, Clock, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MissionCardProps {
  currentWeek: number
  isDeepFocusMode: boolean
}

const missionsByWeek: Record<
  number,
  { title: string; description: string; deadline: string; effort: number; effortLabel: string }
> = {
  0: {
    title: "事前準備を完了する",
    description: "スクール開始前の準備タスクを完了してください。自己紹介と目標設定を行います。",
    deadline: "2025年12月1日",
    effort: 1,
    effortLabel: "15-25min",
  },
  1: {
    title: "思考の破壊 - 固定観念を揺さぶる",
    description: "AIとの対話を通じて、あなたの既存の思考パターンに気づき、新しい視点を発見してください。",
    deadline: "2025年12月5日",
    effort: 2,
    effortLabel: "30-55min",
  },
  2: {
    title: "自分の軸を明確にする",
    description:
      "あなたの「思考の軸」を明確にするため、AIとの対話を通じて自分自身の価値観と信念を言語化してください。拡張案としてまとめます。",
    deadline: "2025年12月12日",
    effort: 3,
    effortLabel: "60-90min",
  },
  3: {
    title: "思考を言語化する",
    description: "複雑な思考を明確な言葉に変換するスキルを習得します。AIとの対話を通じて、表現力を磨いてください。",
    deadline: "2025年12月19日",
    effort: 2,
    effortLabel: "30-55min",
  },
  4: {
    title: "深い問いを設計する",
    description: "本質を突く問いを作る力を養います。静かに集中して、思考を深めてください。",
    deadline: "2025年12月26日",
    effort: 3,
    effortLabel: "60-90min",
  },
  5: {
    title: "仮説を構築する",
    description: "AIと共に、検証可能な仮説を作り上げます。予想外のアイデア(Breakthrough Idea)も歓迎です。",
    deadline: "2026年1月2日",
    effort: 2,
    effortLabel: "30-55min",
  },
  6: {
    title: "具体的なアクションに落とし込む",
    description: "これまでの思考を具体的な行動計画に変換します。拡張案ジェネレーターを活用してください。",
    deadline: "2026年1月9日",
    effort: 3,
    effortLabel: "60-90min",
  },
  7: {
    title: "Demo Day に向けて準備する",
    description: "あなたの学びと成果を発表する準備をします。最終的な拡張案を完成させてください。",
    deadline: "2026年1月16日",
    effort: 4,
    effortLabel: "90-120min",
  },
}

export function MissionCard({ currentWeek, isDeepFocusMode }: MissionCardProps) {
  const mission = missionsByWeek[currentWeek] || missionsByWeek[1]

  return (
    <Card
      className={cn("border-primary/20 backdrop-blur-sm transition-all", isDeepFocusMode ? "bg-card/30" : "bg-card/50")}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          {!isDeepFocusMode && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="w-6 h-6 text-primary" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h2 className="text-lg font-semibold text-foreground">{mission.title}</h2>
              {!isDeepFocusMode && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">進行中</span>
              )}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                {Array.from({ length: mission.effort }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                ))}
                <span className="text-xs font-medium text-primary ml-1">({mission.effortLabel})</span>
              </div>
            </div>
            <p className="text-foreground/90 leading-relaxed">{mission.description}</p>

            {/* Meta Info */}
            {!isDeepFocusMode && (
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>期限: {mission.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>推定時間: {mission.effortLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
