"use server"

import { createClient } from "@/utils/supabase/server"
import OpenAI from "openai"

export interface DiagnosisReport {
  type: "efficiency_master" | "horizontal_dreamer" | "cautious_learner" | "co_creator"
  typeName: string
  catchphrase: string
  analysis: string
  advice: string
  color: string
}

const TYPE_DEFINITIONS = {
  efficiency_master: {
    name: "効率化マイスター",
    english: "Vertical Thinker",
    color: "#3B82F6", // 青
  },
  horizontal_dreamer: {
    name: "夢想する開拓者",
    english: "Horizontal Dreamer",
    color: "#EF4444", // 赤
  },
  cautious_learner: {
    name: "慎重な模索者",
    english: "Cautious Learner",
    color: "#10B981", // 緑
  },
  co_creator: {
    name: "共創する共犯者",
    english: "Co-Creator",
    color: "#8B5CF6", // 紫
  },
}

export async function generateDiagnosisReport(): Promise<DiagnosisReport | { error: string }> {
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

    // オンボーディング回答を取得
    const { data: onboarding, error: fetchError } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (fetchError || !onboarding) {
      return { error: "オンボーディング回答が見つかりません" }
    }

    // OpenAI APIを使用して診断レポートを生成
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const systemPrompt = `あなたは「AI活用タイプ診断」の専門家です。
ユーザーのオンボーディング回答を分析し、以下の4タイプから最も適切なタイプを1つ選んでください。

【タイプA: 効率化マイスター (Vertical Thinker)】
- 特徴: 業務効率化や生産性向上を重視。AIをツールとして活用し、既存のプロセスを改善する。
- 思考スタイル: 論理的、体系的、目標指向
- 典型的な回答: 「業務効率化」を目標に選ぶ、短期集中型、マニュアルを読む

【タイプB: 夢想する開拓者 (Horizontal Dreamer)】
- 特徴: 創造性や新しいアイデア創出を重視。AIと共に未知の領域を開拓したい。
- 思考スタイル: 発散的、創造的、探索的
- 典型的な回答: 「企画作成」「創造性向上」を目標に選ぶ、とりあえず触る、よく書き出す

【タイプC: 慎重な模索者 (Cautious Learner)】
- 特徴: AIへの印象が「よくわからない」「脅威」など。慎重に学びながら活用したい。
- 思考スタイル: 慎重、段階的、学習重視
- 典型的な回答: AIへの印象が「よくわからない」、利用頻度が低い、指示待ち

【タイプD: 共創する共犯者 (Co-Creator)】
- 特徴: AIを「相棒」として捉え、対話を通じて共に創造する。内省を重視。
- 思考スタイル: 対話的、内省的、共創的
- 典型的な回答: AIへの印象が「相棒みたい」、よく書き出す、継続習慣型

以下のJSON形式で回答してください。日本語で記述してください。
{
  "type": "efficiency_master" | "horizontal_dreamer" | "cautious_learner" | "co_creator",
  "catchphrase": "キャッチコピー（例: 'AIを育てる器を持つ者'）",
  "analysis": "現状分析（150文字程度。辛口だが的確に）",
  "advice": "今後の成長アドバイス（150文字程度。Week 1〜3のどの機能が効くかを含めて）"
}`

    const userPrompt = `以下のオンボーディング回答を分析してください：

- 現在の立場: ${onboarding.user_role}
- AIへの印象: ${onboarding.ai_impression}
- AI利用頻度: ${onboarding.ai_usage}
- 実現したいこと: ${onboarding.goals.join(", ")}
- 思考スタイル: ${JSON.stringify(onboarding.thinking_style)}

上記の情報から、最も適切なタイプを判定してください。`

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
      const type = parsed.type as keyof typeof TYPE_DEFINITIONS

      if (!TYPE_DEFINITIONS[type]) {
        throw new Error(`Invalid type: ${type}`)
      }

      const typeInfo = TYPE_DEFINITIONS[type]

      return {
        type,
        typeName: typeInfo.name,
        catchphrase: parsed.catchphrase || "",
        analysis: parsed.analysis || "",
        advice: parsed.advice || "",
        color: typeInfo.color,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error generating diagnosis report:", error)
    return { error: error.message || "診断レポートの生成に失敗しました" }
  }
}


