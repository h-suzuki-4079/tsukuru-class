"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitEntry } from "@/app/actions/entry"

export function EntryForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentState: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.email.trim() || !formData.currentState) {
      setError("お名前、メールアドレス、今の状態は必須です")
      return
    }

    setLoading(true)

    try {
      const result = await submitEntry({
        name: formData.name,
        email: formData.email,
        currentState: formData.currentState,
        message: formData.message || null,
      })

      if ("error" in result) {
        setError(result.error)
      } else {
        router.push("/thanks")
      }
    } catch (err: any) {
      setError(err.message || "送信に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm font-sans">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-sans mb-2 text-slate-300">
          お名前
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-sans mb-2 text-slate-300">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-sans mb-4 text-slate-300">
          今の状態 <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          {[
            "考え方がわからないまま、ずっと頑張ってきた",
            "立ち止まって考える時間が、しばらく取れていない",
            "言葉にできない違和感が、ずっと残っている",
            "どれも、今の自分とは少し違う",
          ].map((option) => (
            <label
              key={option}
              className="flex items-start gap-3 p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-[#FFD700]/50 transition-colors"
            >
              <input
                type="radio"
                name="currentState"
                value={option}
                checked={formData.currentState === option}
                onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                className="mt-1 w-4 h-4 text-[#FFD700] bg-slate-900 border-slate-600 focus:ring-[#FFD700] focus:ring-2"
                required
              />
              <span className="text-base font-sans text-slate-200 flex-1">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-sans mb-2 text-slate-300">
          任意自由記述
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="うまく言葉にならなくて大丈夫です。"
          rows={6}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full font-sans bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#020817] px-8 py-4 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed my-10"
      >
        {loading ? "送信中..." : "この場に、足をかける"}
      </button>
    </form>
  )
}


