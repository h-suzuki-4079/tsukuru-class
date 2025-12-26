"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-300">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* タイトル */}
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#FFD700] mb-12">
            プライバシーポリシー
          </h1>

          {/* 本文 */}
          <div className="space-y-8 font-sans leading-relaxed">
            <p>
              つくるクラス（以下、「当スクール」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第1条（個人情報）
              </h2>
              <p>
                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、連絡先（メールアドレス）、その他の記述等により特定の個人を識別できる情報を指します。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第2条（個人情報の収集方法）
              </h2>
              <p>
                当スクールは、ユーザーが利用登録をする際に氏名、メールアドレス等の個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当スクールの提携先などから収集することがあります。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第3条（個人情報の収集・利用の目的）
              </h2>
              <p>当スクールが個人情報を収集・利用する目的は、以下のとおりです。</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>当スクールサービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当スクールが提供する他のサービスの案内のメールを送付するため</li>
                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                <li>上記の利用目的に付随する目的</li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第4条（利用目的の変更）
              </h2>
              <p>
                当スクールは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第5条（個人情報の第三者提供）
              </h2>
              <p>
                当スクールは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-slate-200 mt-12 mb-4">
                第6条（お問い合わせ窓口）
              </h2>
              <p>
                本ポリシーに関するお問い合わせは、本サービスのお問い合わせフォームよりお願いいたします。
              </p>
            </section>

            <p className="mt-16 text-slate-400 font-serif">
              以上
            </p>
          </div>

          {/* トップに戻るリンク */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-sans text-slate-500 hover:text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}




