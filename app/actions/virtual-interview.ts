"use server"

import OpenAI from "openai"

export interface InterviewMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface InterviewResponse {
  message: string
}

export interface ValidationReport {
  strengths: string[] // 刺さった点
  concerns: string[] // 懸念点
  summary: string // 総評
}

export async function virtualInterview(
  persona: string,
  message: string,
  conversationHistory: InterviewMessage[]
): Promise<InterviewResponse | { error: string }> {
  try {
    if (!message.trim()) {
      return { error: "メッセージを入力してください" }
    }

    if (!persona.trim()) {
      return { error: "ペルソナ設定を入力してください" }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // 会話履歴をOpenAI形式に変換
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `あなたは以下のペルソナになりきって、ユーザーのアイデアに対してフィードバックをしてください。

ペルソナ設定:
${persona}

重要な指示:
- このペルソナの視点、口調、価値観で一貫して話してください
- ユーザーのアイデアに対して、このペルソナならどう感じるか、どう思うかを率直に伝えてください
- 良い点も悪い点も、このペルソナの立場から正直に意見を述べてください
- 1回の返答は200文字程度に収めてください
- 解決策やアドバイスは不要です。このペルソナの反応や感想を伝えるだけにしてください`,
      },
    ]

    // 会話履歴を追加
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    })

    // 現在のメッセージを追加
    messages.push({
      role: "user",
      content: message,
    })

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.8, // ペルソナの個性を出す
        max_tokens: 500,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error("OpenAI API returned empty response")
      }

      return {
        message: response,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error in virtual interview:", error)
    return { error: error.message || "インタビューの実行に失敗しました" }
  }
}

export async function generateValidationReport(
  persona: string,
  conversationHistory: InterviewMessage[]
): Promise<ValidationReport | { error: string }> {
  try {
    if (conversationHistory.length === 0) {
      return { error: "会話履歴がありません" }
    }

    if (!persona.trim()) {
      return { error: "ペルソナ設定がありません" }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // 会話履歴をテキスト形式に変換
    const conversationText = conversationHistory
      .map((msg) => `${msg.role === "user" ? "ユーザー" : "ペルソナ"}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `あなたは優秀なビジネスアナリストです。ユーザーとペルソナの会話を分析し、ユーザーのアイデアに対する検証結果をまとめてください。

以下のJSON形式で回答してください：
{
  "strengths": ["刺さった点1", "刺さった点2", "刺さった点3"],
  "concerns": ["懸念点1", "懸念点2", "懸念点3"],
  "summary": "総評（200文字程度）"
}

注意点:
- strengths: ペルソナが好意的に反応した点、興味を示した点
- concerns: ペルソナが懸念を示した点、疑問を持った点
- summary: 会話全体を踏まえた客観的な総評`

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
            content: `以下のペルソナ設定と会話履歴を分析してください：

ペルソナ設定:
${persona}

会話履歴:
${conversationText}

上記の会話から、ユーザーのアイデアに対する検証結果をまとめてください。`,
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
      if (!parsed.strengths || !Array.isArray(parsed.strengths) || !parsed.concerns || !Array.isArray(parsed.concerns) || !parsed.summary) {
        throw new Error("Invalid response format from OpenAI")
      }

      return {
        strengths: parsed.strengths,
        concerns: parsed.concerns,
        summary: parsed.summary,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error generating validation report:", error)
    return { error: error.message || "検証結果レポートの生成に失敗しました" }
  }
}

