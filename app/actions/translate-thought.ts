"use server"

import OpenAI from "openai"

export type Framework = "prep" | "storytelling" | "metaphor"

export interface TranslateThoughtResult {
  translated: string
}

const FRAMEWORK_DESCRIPTIONS = {
  prep: {
    name: "PREP法 (論理)",
    description: "結論→理由→具体例→結論の構成で、ビジネス向けの論理的な説明",
    systemPrompt: `あなたはプロの編集者です。ユーザーの入力テキストを、PREP法（Point, Reason, Example, Point）に厳密に従ってリライトしてください。

PREP法の構成:
1. Point（結論）: 最初に主張や結論を明確に述べる
2. Reason（理由）: その結論に至った理由を説明する
3. Example（具体例）: 理由を裏付ける具体例や事例を示す
4. Point（結論）: 最後に再度結論を強調する

元の意味を損なわず、構成だけを劇的に変えてください。ビジネス文書やプレゼンテーション向けの論理的な文章に変換してください。`,
  },
  storytelling: {
    name: "ストーリーテリング (共感)",
    description: "ヒーローズ・ジャーニーに基づく物語形式で、共感を生む表現",
    systemPrompt: `あなたはプロの編集者です。ユーザーの入力テキストを、ストーリーテリング（ヒーローズ・ジャーニー）の構造に厳密に従ってリライトしてください。

ヒーローズ・ジャーニーの構成:
1. 日常世界: 主人公の普通の生活
2. 冒険への招待: 変化や挑戦の機会が訪れる
3. 試練と成長: 困難に直面し、それを乗り越える
4. 帰還と変容: 新しい知識や経験を持って戻る

元の意味を損なわず、構成だけを劇的に変えてください。読者の共感を生む物語形式の文章に変換してください。`,
  },
  metaphor: {
    name: "メタファー (比喩)",
    description: "複雑な概念を「何かに例えて」わかりやすく解説",
    systemPrompt: `あなたはプロの編集者です。ユーザーの入力テキストを、メタファー（比喩）を多用した形式に厳密に従ってリライトしてください。

メタファーの特徴:
- 抽象的な概念を具体的なものに例える
- 複雑な仕組みを身近な体験に置き換える
- 視覚的でイメージしやすい表現を使う
- 読者が「なるほど」と納得できる比喩を選ぶ

元の意味を損なわず、構成だけを劇的に変えてください。わかりやすく、印象に残る比喩を使った文章に変換してください。`,
  },
}

export async function translateThought(
  input: string,
  framework: Framework
): Promise<TranslateThoughtResult | { error: string }> {
  try {
    // バリデーション
    if (!input.trim()) {
      return { error: "入力テキストを入力してください" }
    }

    if (!framework || !["prep", "storytelling", "metaphor"].includes(framework)) {
      return { error: "有効なフレームワークを選択してください" }
    }

    // OpenAI APIを使用
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { error: "OpenAI API key is not set" }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const frameworkInfo = FRAMEWORK_DESCRIPTIONS[framework]

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: frameworkInfo.systemPrompt,
          },
          {
            role: "user",
            content: `以下のテキストを、${frameworkInfo.name}のフレームワークに従って変換してください：\n\n${input}`,
          },
        ],
        temperature: 0.8, // 創造性を高める
        max_tokens: 2000,
      })

      const translated = completion.choices[0]?.message?.content
      if (!translated) {
        throw new Error("OpenAI API returned empty response")
      }

      return {
        translated,
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
    }
  } catch (error: any) {
    console.error("Error translating thought:", error)
    return { error: error.message || "思考の翻訳に失敗しました" }
  }
}


