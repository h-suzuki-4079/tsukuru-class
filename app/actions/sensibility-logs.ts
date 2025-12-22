"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export type Emotion = "joy" | "anger" | "sadness" | "fun" | "insight"

export interface SensibilityLog {
  id: string
  user_id: string
  content: string
  emotion: Emotion
  created_at: string
  updated_at: string
}

export async function postLog(content: string, emotion: Emotion) {
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

    // バリデーション
    if (!content.trim()) {
      return { error: "投稿内容を入力してください" }
    }

    if (!emotion || !["joy", "anger", "sadness", "fun", "insight"].includes(emotion)) {
      return { error: "有効な感情を選択してください" }
    }

    // ログを保存
    const { data, error: insertError } = await supabase
      .from("sensibility_logs")
      .insert({
        user_id: user.id,
        content: content.trim(),
        emotion,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting log:", insertError)
      return { error: "ログの保存に失敗しました" }
    }

    // ページを再検証（タイムラインを更新）
    revalidatePath("/dashboard")

    return {
      success: true,
      log: data,
    }
  } catch (error: any) {
    console.error("Error posting log:", error)
    return { error: error.message || "ログの投稿に失敗しました" }
  }
}

export async function getLogs(): Promise<SensibilityLog[] | { error: string }> {
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

    // ログを取得（新しい順）
    const { data: logs, error: fetchError } = await supabase
      .from("sensibility_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching logs:", fetchError)
      return { error: "ログの取得に失敗しました" }
    }

    return logs || []
  } catch (error: any) {
    console.error("Error getting logs:", error)
    return { error: error.message || "ログの取得に失敗しました" }
  }
}

export async function deleteLog(logId: string) {
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

    // ログを削除
    const { error: deleteError } = await supabase
      .from("sensibility_logs")
      .delete()
      .eq("id", logId)
      .eq("user_id", user.id) // 自分のログのみ削除可能

    if (deleteError) {
      console.error("Error deleting log:", deleteError)
      return { error: "ログの削除に失敗しました" }
    }

    // ページを再検証
    revalidatePath("/dashboard")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Error deleting log:", error)
    return { error: error.message || "ログの削除に失敗しました" }
  }
}



