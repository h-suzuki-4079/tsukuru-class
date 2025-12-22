"use server"

import OpenAI from "openai"

export type TimelinePeriod = "1month" | "3months" | "6months"

export interface RoadmapPhase {
  title: string
  tasks: string[]
}

export interface RoadmapResult {
  phases: RoadmapPhase[]
}

const PERIOD_DESCRIPTIONS = {
  "1month": "1ヶ月",
  "3months": "3ヶ月",
  "6months": "6ヶ月",
}

export async function generateRoadmap(
  goal: string,
  period: TimelinePeriod
): Promise<RoadmapResult | { error: string }> {
  try {
    // バリデーション
    if (!goal.trim()) {
      return { error: "目標を入力してください" }
    }

    if (!period || !["1month", "3months", "6months"].includes(period)) {
      return { error: "有効な期間を選択してください" }
    }

    // OpenAI APIを使用
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const periodLabel = PERIOD_DESCRIPTIONS[period]

    const systemPrompt = `あなたは超一流のプロジェクトマネージャーです。ユーザーの漠然とした目標を、具体的かつ実行可能なタスクに分解してください。

重要な原則:
- 精神論ではなく、具体的な行動（Actionable Item）を提示してください
- 各タスクは「誰が」「何を」「いつまでに」が明確になるようにしてください
- 現実的で、実際に実行可能なタスクに分解してください
- 各フェーズは段階的に難易度が上がるように設計してください

出力形式:
以下のJSON形式で、3つのフェーズ（Phase 1: 着手、Phase 2: 継続、Phase 3: 達成）を含めてください：
{
  "phases": [
    {
      "title": "Phase 1: 着手",
      "tasks": ["具体的なタスク1", "具体的なタスク2", "具体的なタスク3", ...]
    },
    {
      "title": "Phase 2: 継続",
      "tasks": ["具体的なタスク1", "具体的なタスク2", "具体的なタスク3", ...]
    },
    {
      "title": "Phase 3: 達成",
      "tasks": ["具体的なタスク1", "具体的なタスク2", "具体的なタスク3", ...]
    }
  ]
}

各フェーズの役割:
- Phase 1 (着手): 直近やるべきこと、最初の一歩、環境整備、リサーチなど
- Phase 2 (継続): 習慣化すべきこと、中間目標、継続的な改善、実践とフィードバック
- Phase 3 (達成): 最終仕上げ、成果の定義、検証と改善、次のステップへの準備

期間: ${periodLabel}`

    const userPrompt = `以下の目標に対して、${periodLabel}で実現するための具体的なロードマップを作成してください：

目標: ${goal}

上記の目標を、Phase 1（着手）、Phase 2（継続）、Phase 3（達成）の3つのフェーズに分けて、各フェーズに具体的なタスクリストを含めてください。`

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
        max_tokens: 2000,
      })

      const generatedContent = completion.choices[0]?.message?.content
      if (!generatedContent) {
        throw new Error("OpenAI API returned empty response")
      }

      const parsed = JSON.parse(generatedContent)

      // バリデーション
      if (!parsed.phases || !Array.isArray(parsed.phases) || parsed.phases.length !== 3) {
        throw new Error("Invalid response format from OpenAI: phases must be an array with 3 items")
      }

      // 各フェーズのバリデーション
      for (const phase of parsed.phases) {
        if (!phase.title || !phase.tasks || !Array.isArray(phase.tasks)) {
          throw new Error("Invalid response format from OpenAI: each phase must have title and tasks array")
        }
      }

      return {
        phases: parsed.phases,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error generating roadmap:", error)
    return { error: error.message || "ロードマップの生成に失敗しました" }
  }
}



