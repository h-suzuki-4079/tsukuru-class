"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200">
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-semibold text-[#FFD700] mb-12">
            ここまで読んでくれたあなたへ
          </h1>

          <div className="space-y-6 text-base leading-[1.91] font-serif">
            <p>こんにちは。ご登録ありがとうございます。</p>

            <p>
              ここまでこのページを読んでくれたあなたなら、もう少しだけ、先の話をしてもいいかもしれません。
            </p>

            <p>
              この7週間は、「成長するための時間」でも、「何かを達成するための期間」でもありません。
            </p>

            <p>
              多くの人が、考え方がわからないまま、それでも頑張り続けてきました。
            </p>

            <p>
              この場で扱うのは、その"頑張り方"を変える方法ではなく、立ち止まって、考え直すための時間です。
            </p>

            <p>
              急ぐ必要はありません。決める必要もありません。
            </p>

            <p>
              ただ、ここまで来たあなたには、「考え直す」という選択肢が、すでに見えているはずです。
            </p>

            <p>
              24時間以内に、私からご登録のアドレスへ、
              これからの流れを記した「招待状（メール）」をお送りします。
            </p>

            <p>
              費用や、参加のタイミングについても、
              そちらで詳しくご案内します。
            </p>

            <p>
              それまでは、少しだけお待ちください。
              今日は、ここまでで大丈夫です。
            </p>
          </div>

          <div className="mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-sans text-slate-400 hover:text-[#FFD700] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


