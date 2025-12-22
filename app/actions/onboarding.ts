"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface OnboardingFormData {
  user_role: string
  ai_impression: string
  ai_usage: string
  ai_skill_level: string // 自分のAIスキル感
  goals: string[]
  thinking_style: {
    achievement_style: string // 短期集中型 vs 継続習慣型
    reflection_depth: string // よく書き出す vs 苦手 vs 考えない
    learning_style: string // とりあえず触る vs マニュアル読む vs 指示待ち
    ai_skill_level: string // 自分のAIスキル感（thinking_styleに含める）
  }
}

export async function checkOnboardingStatus() {
  try {
    const supabase = await createClient()

    // ユーザー認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { hasOnboarding: false, error: "認証が必要です" }
    }

    // オンボーディング回答をチェック
    const { data: onboarding, error: fetchError } = await supabase
      .from("onboarding_answers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (fetchError || !onboarding) {
      return { hasOnboarding: false }
    }

    return { hasOnboarding: true }
  } catch (error: any) {
    console.error("Error checking onboarding status:", error)
    return { hasOnboarding: false, error: error.message }
  }
}

export async function saveOnboardingAction(data: OnboardingFormData) {
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

    // 既存の回答があるかチェック
    const { data: existing } = await supabase
      .from("onboarding_answers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // 更新
      const { error: updateError } = await supabase
        .from("onboarding_answers")
        .update({
          user_role: data.user_role,
          ai_impression: data.ai_impression,
          ai_usage: data.ai_usage,
          goals: data.goals,
          thinking_style: {
            ...data.thinking_style,
            ai_skill_level: data.ai_skill_level,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating onboarding:", updateError)
        return { error: "オンボーディング情報の更新に失敗しました" }
      }
    } else {
      // 新規作成
      const { error: insertError } = await supabase.from("onboarding_answers").insert({
        user_id: user.id,
        user_role: data.user_role,
        ai_impression: data.ai_impression,
        ai_usage: data.ai_usage,
        goals: data.goals,
        thinking_style: {
          ...data.thinking_style,
          ai_skill_level: data.ai_skill_level,
        },
      })

      if (insertError) {
        console.error("Error inserting onboarding:", insertError)
        return { error: "オンボーディング情報の保存に失敗しました" }
      }
    }

    // ページを再検証
    revalidatePath("/dashboard")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Error saving onboarding:", error)
    return { error: error.message || "オンボーディング情報の保存に失敗しました" }
  }
}
