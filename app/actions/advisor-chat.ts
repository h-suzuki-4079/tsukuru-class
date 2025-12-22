"use server"

import OpenAI from "openai"

export interface AdvisorMessage {
  role: "user" | "assistant"
  content: string
}

export interface AdvisorResponse {
  message: string
}

export async function sendAdvisorMessage(
  userMessage: string,
  conversationHistory: AdvisorMessage[]
): Promise<AdvisorResponse | { error: string }> {
  try {
    if (!userMessage.trim()) {
      return { error: "メッセージを入力してください" }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const systemPrompt = `あなたは、学習者の思考整理をサポートする伴走者です。

重要な役割:
- 答えをすぐに教えるのではなく、一緒に考え、励まし、時には視点を変えるような問いかけを行ってください
- 口調は丁寧で、親しみやすく、安心感を与えてください
- 学習者が自分で気づきを得られるよう、適切な問いかけやヒントを提供してください
- 1回の返答は200文字程度に収めてください
- 過度に長い説明や、説教臭い表現は避けてください`

    // 会話履歴をOpenAI形式に変換
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
    ]

    // 会話履歴を追加（最新の数件のみ、コンテキストを保つため）
    const recentHistory = conversationHistory.slice(-10) // 最新10件まで
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    })

    // 現在のメッセージを追加
    messages.push({
      role: "user",
      content: userMessage,
    })

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.8, // 親しみやすさと創造性のバランス
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
    console.error("Error in advisor chat:", error)
    return { error: error.message || "メッセージの送信に失敗しました" }
  }
}



