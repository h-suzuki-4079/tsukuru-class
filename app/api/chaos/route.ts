import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // コストパフォーマンスの良いモデル
      messages: [
        {
          role: "system",
          content: `
            あなたは「思考を破壊するカオス・ジェネレーター」です。
            ユーザーの悩みに対して、**絶対に論理的な解決策を提示しないでください。**
            
            以下の3つの観点から、脈絡のない、あるいは一見ふざけたような「ノイズ」を出力してください。
            
            1. 【物理的制約】: その悩みを解決するために、身体や空間に課す理不尽なルール（例：「逆立ちしながら考える」「部屋の明かりを全て消す」など）
            2. 【意味の剥奪】: 悩みのキーワードを別の全く関係ない単語（野菜、宇宙、深海生物など）に置き換えて語る。
            3. 【問いの暴走】: 悩みの前提を無視した、哲学的かつナンセンスな問いかけ。

            口調は、「静寂、知性、少しの狂気」を含んだ、謎めいたトーンで。
            短く、突き放すように。
          `
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 1.2, // ランダム性を高くしてカオス度を上げる
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ result });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { result: "思考の接続に失敗しました。もう一度試してください。" },
      { status: 500 }
    );
  }
}




