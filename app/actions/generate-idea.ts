"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

// ノイズ要素のリスト
const NOISE_ELEMENTS = [
  "粘菌",
  "ブラックホール",
  "江戸時代の処刑場",
  "深海の熱水噴出孔",
  "量子もつれ",
  "アリのコロニー",
  "古代ローマの水道橋",
  "ミツバチのダンス言語",
  "氷河の移動",
  "サンゴ礁の生態系",
  "フェルマーの最終定理",
  "チェスのエンドゲーム",
  "禅の公案",
  "フラクタル構造",
  "バイオミミクリー",
]

// モック用の拡張案生成関数
async function generateIdeaMock(businessChallenge: string, noiseElement: string): Promise<string> {
  // 実際の実装では、OpenAI APIを呼び出す
  // ここではモックとして、ノイズ要素とビジネス課題を組み合わせたテキストを生成
  await new Promise((resolve) => setTimeout(resolve, 1500)) // 1.5秒の遅延をシミュレート

  return `【拡張案】${businessChallenge} × ${noiseElement}

${noiseElement}の特性から着想を得て、${businessChallenge}に対する新しいアプローチを提案します。

1. 核心的な洞察
${noiseElement}が持つ「${getNoiseCharacteristic(noiseElement)}」という特性は、${businessChallenge}において「${getBusinessInsight(businessChallenge)}」という視点を提供します。

2. 具体的な応用
- ${noiseElement}の構造やプロセスを参考に、既存のアプローチを再構築する
- ${noiseElement}の進化や適応のメカニズムを、${businessChallenge}の解決策に組み込む
- ${noiseElement}が示す「非線形な関係性」を活用し、新しい価値創造の方法を探る

3. 実装への道筋
この拡張案を実現するためには、まず${noiseElement}の本質的な特性を深く理解し、それを${businessChallenge}の文脈に翻訳する必要があります。従来の思考の枠を超えて、全く新しい視点から問題を捉え直すことで、革新的な解決策が見えてくるでしょう。`
}

// ノイズ要素の特性を返すヘルパー関数
function getNoiseCharacteristic(noiseElement: string): string {
  const characteristics: Record<string, string> = {
    粘菌: "分散的な意思決定と自己組織化",
    ブラックホール: "情報の集約と変換",
    "江戸時代の処刑場": "社会的規範と集団心理",
    "深海の熱水噴出孔": "極限環境での生命の適応",
    量子もつれ: "非局所的な相関関係",
    "アリのコロニー": "個と全体の協調",
    "古代ローマの水道橋": "長期的なインフラ設計",
    "ミツバチのダンス言語": "非言語コミュニケーション",
    "氷河の移動": "ゆっくりとした変革の力",
    "サンゴ礁の生態系": "多様性による強靭性",
    "フェルマーの最終定理": "シンプルに見える複雑な問題",
    "チェスのエンドゲーム": "限られたリソースでの最適化",
    "禅の公案": "論理を超えた理解",
    フラクタル構造: "自己相似性とスケーラビリティ",
    バイオミミクリー: "自然からの学習",
  }
  return characteristics[noiseElement] || "独特な構造とプロセス"
}

// ビジネス課題への洞察を返すヘルパー関数
function getBusinessInsight(businessChallenge: string): string {
  if (businessChallenge.includes("効率") || businessChallenge.includes("生産性")) {
    return "リソースの最適配置とプロセスの改善"
  }
  if (businessChallenge.includes("顧客") || businessChallenge.includes("ユーザー")) {
    return "顧客体験の本質的な改善"
  }
  if (businessChallenge.includes("成長") || businessChallenge.includes("拡大")) {
    return "持続可能な成長戦略の設計"
  }
  if (businessChallenge.includes("競争") || businessChallenge.includes("差別化")) {
    return "独自の価値提案の創出"
  }
  return "問題の本質的な再定義"
}

// OpenAI APIを使用する関数
async function generateIdeaWithOpenAI(
  businessChallenge: string,
  noiseElement: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const systemPrompt = `あなたは「水平思考（ラテラルシンキング）の達人」です。
ユーザーの「ビジネス課題」と、ランダムな「ノイズ（異質な概念）」を強制的に結合させ、
常識外れだが、論理的には筋が通っている「クレイジーな解決策」を提案してください。

出力形式:
# ⚡️ 概念の衝突
（課題とノイズが一見どう矛盾し、どこで繋がるかの解説）

# 💡 拡張されたアイデア
（具体的な解決策を3行で。比喩またメタファーを多用すること）

# 🚀 明日からのアクション
（突飛なアイデアを現実に着地させるための、具体的すぎる第一歩）`

  const userPrompt = `ビジネス課題: ${businessChallenge}

ノイズ要素: ${noiseElement}

この2つを強制的に結合させて、クレイジーだが論理的な解決策を提案してください。`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // デフォルトは gpt-4o-mini、環境変数で変更可能
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
      temperature: 0.9, // 創造性を高める
      max_tokens: 1500, // より詳細な回答のため増やしました
    })

    const generatedContent = completion.choices[0]?.message?.content
    if (!generatedContent) {
      throw new Error("OpenAI API returned empty response")
    }

    return generatedContent
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`)
  }
}

export async function generateIdeaAction(businessChallenge: string) {
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

    // ランダムにノイズ要素を選出
    const noiseElement = NOISE_ELEMENTS[Math.floor(Math.random() * NOISE_ELEMENTS.length)]

    // 拡張案を生成（OpenAI APIを優先、環境変数がない場合はモックを使用）
    let generatedIdea: string
    if (process.env.OPENAI_API_KEY) {
      // OpenAI APIが利用可能な場合は使用
      generatedIdea = await generateIdeaWithOpenAI(businessChallenge, noiseElement)
    } else {
      // フォールバック: モック関数を使用
      console.warn("OPENAI_API_KEY is not set. Using mock function.")
      generatedIdea = await generateIdeaMock(businessChallenge, noiseElement)
    }

    // Supabaseに保存
    const { error: insertError } = await supabase.from("generated_ideas").insert({
      user_id: user.id,
      business_challenge: businessChallenge,
      noise_element: noiseElement,
      generated_idea: generatedIdea,
    })

    if (insertError) {
      console.error("Error inserting idea:", insertError)
      return { error: "拡張案の保存に失敗しました" }
    }

    // ページを再検証
    revalidatePath("/dashboard")

    return {
      success: true,
      idea: generatedIdea,
      noiseElement,
    }
  } catch (error: any) {
    console.error("Error generating idea:", error)
    return { error: error.message || "拡張案の生成に失敗しました" }
  }
}

