"use server"

import OpenAI from "openai"

export type Perspective = "why" | "critical" | "reframing"

export interface GenerateQuestionsResult {
  questions: string[]
}

const PERSPECTIVE_DESCRIPTIONS = {
  why: {
    name: "本質追求 (Why?)",
    description: "「なぜ？」を繰り返して深堀りする",
    systemPrompt: `あなたはソクラテスのような哲学者です。ユーザーの悩みに対し、解決策は絶対に言わず、**ハッとさせられるような『問い』のみ**を3つ提示してください。

視点: 本質追求 (Why?)
- 「なぜ？」を繰り返して、問題の本質を深掘りする問いを立てる
- 表面的な問題の裏にある、より根本的な問いを探る
- 例: 「なぜそれが問題なのか？」「なぜその解決策が必要なのか？」「なぜ今、その悩みを感じているのか？」

解決策やアドバイスは一切言わず、思考を深めるための問いだけを提示してください。`,
  },
  critical: {
    name: "悪魔の代弁者 (Critical)",
    description: "あえて反対意見や盲点を突く",
    systemPrompt: `あなたは本質しか興味のないリアリストです。ユーザーの悩みに対し、解決策は絶対に言わず、**ハッとさせられるような『問い』のみ**を3つ提示してください。

視点: 悪魔の代弁者 (Critical)
- 丁寧語は不要です。短く、単刀直入に相手の痛いところを突いてください。
- 「そもそもその前提が間違っていたら？」「それは自己満足ではないか？」といった、根本を揺るがす問いを投げかけてください。
- ユーザーが当たり前だと思っている前提を、容赦なく疑う
- 表面的な問題の裏にある、都合の悪い真実を暴く
- 例: 「その前提、本当に正しいの？」「それ、自己満足じゃない？」「見落としてるリスク、ない？」

解決策やアドバイスは一切言わず、思考を深めるための問いだけを提示してください。`,
  },
  reframing: {
    name: "視点移動 (Reframing)",
    description: "「もしあなたがドラえもんだったら？」「100年後の未来なら？」など視点をズラす",
    systemPrompt: `あなたはソクラテスのような哲学者です。ユーザーの悩みに対し、解決策は絶対に言わず、**ハッとさせられるような『問い』のみ**を3つ提示してください。

視点: 視点移動 (Reframing)
- 異なる視点や立場から問題を見直す問いを立てる
- 時間、空間、立場、スケールなどを変えて考える
- 例: 「もしあなたがドラえもんだったら、どう考える？」「100年後の未来から見たら、これはどう見える？」「全く違う業界の人なら、どう捉える？」

解決策やアドバイスは一切言わず、思考を深めるための問いだけを提示してください。`,
  },
}

export async function generateQuestions(
  concern: string,
  perspective: Perspective
): Promise<GenerateQuestionsResult | { error: string }> {
  try {
    // バリデーション
    if (!concern.trim()) {
      return { error: "悩みや行き詰まっていることを入力してください" }
    }

    if (!perspective || !["why", "critical", "reframing"].includes(perspective)) {
      return { error: "有効な視点を選択してください" }
    }

    // OpenAI APIを使用
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const perspectiveInfo = PERSPECTIVE_DESCRIPTIONS[perspective]

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: perspectiveInfo.systemPrompt,
          },
          {
            role: "user",
            content: `以下の悩みに対して、${perspectiveInfo.name}の視点から、思考を深めるための問いを3つ立ててください：\n\n${concern}`,
          },
        ],
        temperature: 0.9, // 創造性を高める
        max_tokens: 1000,
      })

      const generatedContent = completion.choices[0]?.message?.content
      if (!generatedContent) {
        throw new Error("OpenAI API returned empty response")
      }

      // 生成されたテキストから質問を抽出（番号付きリストや箇条書きから）
      const questions = generatedContent
        .split(/\n+/)
        .map((line) => line.replace(/^[\d・\-\*]\s*/, "").trim())
        .filter((line) => line.length > 0 && line.match(/[？?]/))
        .slice(0, 3) // 最大3つ

      // もし質問が抽出できなかった場合、生成されたテキストをそのまま使用
      if (questions.length === 0) {
        // テキストを3つの質問に分割する試み
        const sentences = generatedContent.split(/[。！？\n]/).filter((s) => s.trim().length > 0)
        const extractedQuestions = sentences
          .filter((s) => s.includes("？") || s.includes("?") || s.length > 20)
          .slice(0, 3)
          .map((s) => s.trim())

        if (extractedQuestions.length > 0) {
          return {
            questions: extractedQuestions,
          }
        }

        // 最後の手段: 生成されたテキストをそのまま返す
        return {
          questions: [generatedContent.trim()],
        }
      }

      return {
        questions: questions.slice(0, 3),
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error generating questions:", error)
    return { error: error.message || "問いの生成に失敗しました" }
  }
}

