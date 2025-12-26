"use server"

import { createClient } from "@/utils/supabase/server"
import { generateDiagnosisReport } from "./diagnosis"

export interface GraduationData {
  userName: string
  title: string
  goal: string
  date: string
}

const TYPE_DEFINITIONS = {
  efficiency_master: {
    name: "効率化マイスター",
    english: "Vertical Thinker",
  },
  horizontal_dreamer: {
    name: "夢想する開拓者",
    english: "Horizontal Dreamer",
  },
  cautious_learner: {
    name: "慎重な模索者",
    english: "Cautious Learner",
  },
  co_creator: {
    name: "共創する共犯者",
    english: "Co-Creator",
  },
}

export async function getGraduationData(): Promise<GraduationData | { error: string }> {
  try {
    const supabase = await createClient()

    // ユーザー認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: "認証が必要です" }
    }

    // ユーザー名を取得（emailから取得、またはuser_metadataから）
    const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Learning Traveler"

    // 診断タイプを取得
    const diagnosisResult = await generateDiagnosisReport()
    let title = "Explorer"
    if (!("error" in diagnosisResult)) {
      const typeInfo = TYPE_DEFINITIONS[diagnosisResult.type]
      title = typeInfo.english || typeInfo.name
    }

    // Week 6の目標は現在DBに保存されていないため、デフォルト値を使用
    // 将来的にDBに保存する場合は、ここで取得する
    const goal = "To Change the World"

    // 今日の日付を取得
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      userName,
      title,
      goal,
      date,
    }
  } catch (error: any) {
    console.error("Error getting graduation data:", error)
    return { error: error.message || "修了証データの取得に失敗しました" }
  }
}





