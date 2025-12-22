"use server"

import { createClient } from "@/utils/supabase/server"
import OpenAI from "openai"

export interface Week2Analysis {
  core_values: string[]
  hidden_block: string
  weekly_summary: string
}

export async function analyzeWeek2Logs(): Promise<Week2Analysis | { error: string }> {
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

    // ユーザーの全ログを取得（新しい順）
    const { data: logs, error: fetchError } = await supabase
      .from("sensibility_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching logs:", fetchError)
      return { error: "ログの取得に失敗しました" }
    }

    if (!logs || logs.length === 0) {
      return { error: "分析するログがありません。まずは内省を記録してみましょう。" }
    }

    // OpenAI APIを使用して分析
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // ログを時系列で整理（古い順）
    const sortedLogs = [...logs].reverse()

    // ログをテキスト形式に変換
    const logsText = sortedLogs
      .map((log) => {
        const emotionLabels: Record<string, string> = {
          joy: "喜び",
          anger: "怒り",
          sadness: "悲しみ",
          fun: "楽しみ",
          insight: "気づき",
        }
        const date = new Date(log.created_at).toLocaleDateString("ja-JP")
        return `[${date}] ${emotionLabels[log.emotion] || log.emotion}: ${log.content}`
      })
      .join("\n")

    const systemPrompt = `あなたは優秀なメンタルコーチです。
ユーザーの独り言（ログ）から、その裏にある「大切にしている価値観」と「恐れ」を言語化してください。

以下のJSON形式で回答してください：
{
  "core_values": ["価値観1", "価値観2", "価値観3"],
  "hidden_block": "目標達成を阻んでいるかもしれない無意識の思い込み",
  "weekly_summary": "1週間の感情傾向の総評（150文字程度）"
}

注意点:
- core_valuesは3つ程度、簡潔に（各10文字以内が理想）
- hidden_blockは具体的で、建設的な指摘を
- weekly_summaryは150文字程度で、感情の傾向と変化を要約`

    const userPrompt = `以下のログを分析してください：

${logsText}

上記のログから、ユーザーの価値観、無意識のブロック、1週間の傾向を分析してください。`

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      })

      const generatedContent = completion.choices[0]?.message?.content
      if (!generatedContent) {
        throw new Error("OpenAI API returned empty response")
      }

      const parsed = JSON.parse(generatedContent)

      // バリデーション
      if (
        !parsed.core_values ||
        !Array.isArray(parsed.core_values) ||
        !parsed.hidden_block ||
        !parsed.weekly_summary
      ) {
        throw new Error("Invalid response format from OpenAI")
      }

      return {
        core_values: parsed.core_values,
        hidden_block: parsed.hidden_block,
        weekly_summary: parsed.weekly_summary,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error analyzing logs:", error)
    return { error: error.message || "ログの分析に失敗しました" }
  }
}



