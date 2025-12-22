"use server"

import { createClient } from "@/utils/supabase/server"

export interface EntryFormData {
  name: string
  email: string
  currentState: string
  message: string | null
}

export async function submitEntry(data: EntryFormData): Promise<{ success: boolean } | { error: string }> {
  try {
    const supabase = await createClient()

    // バリデーション
    if (!data.name.trim() || !data.email.trim() || !data.currentState) {
      return { error: "お名前、メールアドレス、今の状態は必須です" }
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { error: "有効なメールアドレスを入力してください" }
    }

    // entriesテーブルに保存
    const { error: insertError } = await supabase.from("entries").insert({
      name: data.name.trim(),
      email: data.email.trim(),
      current_state: data.currentState,
      message: data.message?.trim() || null,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting entry:", insertError)
      return { error: "エントリーの保存に失敗しました。もう一度お試しください。" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error submitting entry:", error)
    return { error: error.message || "エントリーの送信に失敗しました" }
  }
}



