"use client"

import { useRef, useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { EntryForm } from "@/components/entry-form"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // 金色の粒子を生成
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-200">
      {/* FV: First View */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
        {/* 金色の粒子エフェクト */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-[#FFD700] rounded-full opacity-30 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-base leading-[1.91] font-serif"
          >
            考え方がわからないまま、ずっと頑張ってきた。
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base leading-[1.91] font-serif"
          >
            変わる方法より先に、<span className="text-[#FFD700] font-serif">考え直す</span>という選択肢があります。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 mb-6"
          >
            {/* スマホ: タイトルの上中央にロゴ */}
            <div className="flex flex-col items-center gap-4 md:hidden">
              {/* ロゴ画像：スタイル完全リセット版 */}
              <div className="relative flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="つくるクラス Logo"
                  width={60}
                  height={60}
                  className="object-contain w-12 h-12"
                  priority
                  unoptimized
                />
              </div>
              <h1 className="text-2xl font-serif font-semibold leading-[1.91]">
                つくるクラス
                <br />
                <span className="text-[#FFD700]">"考えられる自分"をつくる7週間</span>
              </h1>
            </div>
            {/* PC: タイトルの左側にロゴ */}
            <div className="hidden md:flex items-center justify-center gap-4">
              {/* ロゴ画像：スタイル完全リセット版 */}
              <div className="relative flex items-center justify-center mr-4">
                <Image
                  src="/logo.png"
                  alt="つくるクラス Logo"
                  width={60}
                  height={60}
                  className="object-contain w-12 h-12 md:w-16 md:h-16"
                  priority
                  unoptimized
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold leading-[1.91]">
                つくるクラス
                <br />
                <span className="text-[#FFD700]">"考えられる自分"をつくる7週間</span>
              </h1>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={scrollToForm}
            className="font-sans bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#020817] px-8 py-4 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-300 my-10"
          >
            この場に、足をかける
          </motion.button>
        </div>
      </section>

      {/* Intro: 導入：違和感 */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <p className="text-base leading-[1.91] font-serif mb-6">
          この7週間は、ある違和感から始まりました。
        </p>
        <p className="text-base leading-[1.91] font-serif mb-6">
          多くの人が、考え方がわからないまま、それでも頑張り続けてきました。効率化の方法、スキルアップの技術、成果を出すための戦略。それらは確かに役に立ちます。でも、その前に、立ち止まって考え直す時間が、本当は必要だったのではないか。
        </p>
        <p className="text-base leading-[1.91] font-serif mb-6">
          この場で扱うのは、その"頑張り方"を変える方法ではありません。無視せず、押し込めず、少しずつ言葉にしていくための時間です。
        </p>
      </section>

      {/* Values: 大切にしていること */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">大切にしていること</h2>
        <div className="space-y-8">
          <div className="relative border border-slate-600 p-6 rounded-lg">
            <div className="absolute top-4 left-4 text-6xl font-serif text-slate-800 opacity-20">1</div>
            <div className="relative z-10">
              <h3 className="text-lg font-serif mb-4">問いを急がない</h3>
              <p className="text-base leading-[1.91] font-serif">
                答えを急がず、まずは問いを立てる。その問いが、あなた自身の言葉で生まれるまで、待つ時間を大切にします。
              </p>
            </div>
          </div>
          <div className="relative border border-slate-600 p-6 rounded-lg">
            <div className="absolute top-4 left-4 text-6xl font-serif text-slate-800 opacity-20">2</div>
            <div className="relative z-10">
              <h3 className="text-lg font-serif mb-4">一人で抱えない</h3>
              <p className="text-base leading-[1.91] font-serif">
                思考は、一人で閉じ込めるものではありません。AIと対話し、仲間と共有し、言葉にすることで、思考は形を変えていきます。
              </p>
            </div>
          </div>
          <div className="relative border border-slate-600 p-6 rounded-lg">
            <div className="absolute top-4 left-4 text-6xl font-serif text-slate-800 opacity-20">3</div>
            <div className="relative z-10">
              <h3 className="text-lg font-serif mb-4">実務と内面を切り離さない</h3>
              <p className="text-base leading-[1.91] font-serif">
                仕事の悩みと、自分の内面の声は、実はつながっています。そのつながりを見つけることで、本当の変化が始まります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey: 何が、どんな順番で起きるか */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">何が、どんな順番で起きるか</h2>
        <div className="space-y-12">
          <div className="relative pl-8 border-l-2 border-[#FFD700]">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-[#FFD700] rounded-full" />
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold">STEP 1: 衝撃 - 思考の破壊</h3>
              <p className="text-base leading-[1.91] font-serif">
                まず、今までの考え方の枠組みを一度、揺さぶります。異質な概念との出会いを通じて、新しい視点を獲得します。
              </p>
            </div>
          </div>
          <div className="relative pl-8 border-l-2 border-[#FFD700]">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-[#FFD700] rounded-full" />
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold">STEP 2: 内省 - 自分の軸</h3>
              <p className="text-base leading-[1.91] font-serif">
                内面の声を、少しずつ言葉にしていきます。感情や違和感を、無視せず、押し込めず、記録していく時間です。
              </p>
            </div>
          </div>
          <div className="relative pl-8 border-l-2 border-[#FFD700]">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-[#FFD700] rounded-full" />
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold">STEP 3: 統合 - アクション</h3>
              <p className="text-base leading-[1.91] font-serif">
                思考を整理し、具体的な行動計画に落とし込みます。でも、それは「やるべきこと」のリストではなく、「考え直した結果」としてのロードマップです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Curriculum: 何を教えないか */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">何を教えないか</h2>
        <div className="space-y-6">
          <p className="text-base leading-[1.91] font-serif">
            <strong className="text-[#FFD700]">教えない。</strong>答えを先に提示することはありません。あなた自身が問いを立て、考え、言葉にしていく過程を大切にします。
          </p>
          <p className="text-base leading-[1.91] font-serif">
            <strong className="text-[#FFD700]">前に出さない。</strong>講師が前に立って、一方的に話す時間はありません。この場の主役は、あなたです。
          </p>
          <p className="text-base leading-[1.91] font-serif">
            <strong className="text-[#FFD700]">強制しない。</strong>「これをやらなければならない」という強制はありません。あなたのペースで、あなたの言葉で、進んでいきます。
          </p>
        </div>
      </section>

      {/* Philosophy: 生成AIとの関わり */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">生成AIとの関わり</h2>
        <p className="text-base leading-[1.91] font-serif mb-6">
          AIは、あなたの思考を映し出す鏡です。あなたが言葉にしたことを、AIが返してくる。その対話を通じて、あなた自身の思考が、より明確になっていきます。
        </p>
        <h3 className="text-3xl font-serif font-semibold text-[#FFD700] mt-12 mb-6">
          それでも、主役はあなたです
        </h3>
        <p className="text-base leading-[1.91] font-serif">
          AIは便利なツールですが、思考の主体は、あくまであなた自身です。AIと対話することで、あなた自身の声が、より聞こえやすくなります。
        </p>
      </section>

      {/* Environment: 場と人の話 */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">場と人の話</h2>
        <p className="text-base leading-[1.91] font-serif mb-6">
          この場は、図書館のような静かな場所です。騒がしい励ましも、熱い応援も、必要ありません。
        </p>
        <p className="text-base leading-[1.91] font-serif">
          静かなる共存。それぞれが、それぞれのペースで、それぞれの言葉で、思考を深めていく。そんな場を、一緒につくっていきます。
        </p>
      </section>

      {/* Output: 扱うアウトプット */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">扱うアウトプット</h2>
        <p className="text-base leading-[1.91] font-serif mb-6">
          この場で生まれるのは、「完成された成果物」ではありません。途中の言葉、途中の思考、途中の問い。それらを、評価せず、比較せず、ただ記録していきます。
        </p>
        <p className="text-base leading-[1.91] font-serif">
          うまく言葉にならなくても、大丈夫です。その「うまく言葉にならない」という状態も、大切なアウトプットです。
        </p>
      </section>

      {/* Aftermath: 残るもの */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">残るもの</h2>
        <p className="text-base leading-[1.91] font-serif mb-6">
          この7週間が終わった後、あなたに残るのは、何か具体的な成果物かもしれません。でも、それ以上に大切なのは、「立ち止まって考え直す」という状態です。
        </p>
        <p className="text-base leading-[1.91] font-serif">
          その状態が、あなたの中に残り続ける。それが、この7週間の、本当の成果です。
        </p>
      </section>

      {/* Targeting: 向いている人 / 向いていない人 */}
      <section className="px-4 py-16 max-w-xl mx-auto">
        <h2 className="text-xl font-serif mt-12 mb-6">向いている人 / 向いていない人</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-slate-600 p-6 rounded-lg">
            <h3 className="text-lg font-serif font-semibold mb-4 text-[#FFD700]">向いている人</h3>
            <ul className="space-y-3 text-base leading-[1.91] font-serif">
              <li>• 考え方がわからないまま、ずっと頑張ってきた人</li>
              <li>• 立ち止まって考える時間が、しばらく取れていない人</li>
              <li>• 言葉にできない違和感が、ずっと残っている人</li>
              <li>• 答えよりも、問いを大切にしたい人</li>
            </ul>
          </div>
          <div className="border border-slate-600 p-6 rounded-lg">
            <h3 className="text-lg font-serif font-semibold mb-4 text-slate-500">向いていない人</h3>
            <ul className="space-y-3 text-base leading-[1.91] font-serif text-slate-500">
              <li>• すぐに答えが欲しい人</li>
              <li>• 明確な成果物を求めている人</li>
              <li>• 一方的に教えてもらいたい人</li>
              <li>• 強制されることを望む人</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ending & Final Form */}
      <section ref={formRef} className="px-4 py-16 max-w-xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="w-12 h-12 text-[#FFD700] mx-auto mb-6" />
          <p className="text-base leading-[1.91] font-serif mb-6">
            ここまで読んでくれたあなたなら、もう少しだけ、先の話をしてもいいかもしれません。
          </p>
          <p className="text-base leading-[1.91] font-serif">
            この場で扱うのは、その"頑張り方"を変える方法ではありません。無視せず、押し込めず、少しずつ言葉にしていくための時間です。
          </p>
        </div>
        <EntryForm />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <a href="/privacy" className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors tracking-widest">
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}
