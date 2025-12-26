"use client";

import React, { useState } from "react";
import { AudioPlayer } from "@/components/course/audio-player";
import { Sparkles, Loader2 } from "lucide-react";

interface Week1PageProps {
  isDeepFocusMode?: boolean;
}

export function Week1Page({}: Week1PageProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      // APIルート (/api/chaos) を呼び出す
      const response = await fetch('/api/chaos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);

    } catch (error) {
      console.error(error);
      setResult("思考のノイズの中にエラーが発生しました。もう一度、ボタンを押してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      
      {/* 1. ヘッダーエリア */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#FFD700] mb-2">
          <Sparkles size={16} />
          <span className="text-xs font-sans tracking-widest uppercase">Week 1</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-slate-200 leading-tight">
          衝撃・思考の破壊
        </h1>
        <p className="text-slate-400 font-serif leading-relaxed text-lg">
          効率や正解を求める「脳のフィルター」を、強制的に外す時間です。<br/>
          まずは静寂の中で、以下の音声を再生してください。
        </p>
      </div>

      {/* 2. 音声プレイヤー実装箇所 */}
      <section className="relative z-10">
        <AudioPlayer 
          src="/audio/week1-intro.m4a" 
          title="導入：ノイズを許容する" 
        />
      </section>

      {/* 区切り線 */}
      <hr className="border-slate-800" />

      {/* 3. ワークエリア（拡張案ジェネレーター） */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-serif text-slate-200 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FFD700] text-[#020817] flex items-center justify-center font-sans font-bold text-sm">
              Work
            </span>
            拡張案ジェネレーター
          </h2>
          <p className="text-slate-400 text-sm font-sans pl-11">
            あなたの抱えているビジネス課題や悩みを入力してください。<br/>
            AIが脈絡のない「ノイズ」をぶつけ、思考を揺さぶりにかかります。
          </p>
        </div>

        {/* 入力フォームエリア */}
        <div className="bg-[#0B1221] border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
          <label className="block text-slate-400 text-xs font-sans mb-2 tracking-wider">
            ビジネス課題を入力してください
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 顧客のエンゲージメントを向上させたい、新規事業のアイデアが出ない..."
            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/50 transition-all font-sans resize-none"
          />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !input}
              className="bg-[#FFD700] text-[#020817] px-8 py-3 rounded-lg font-sans font-bold flex items-center gap-2 hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  拡張案を生成
                </>
              )}
            </button>
          </div>
        </div>

        {/* 結果表示エリア */}
        {result && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-8 relative overflow-hidden">
              {/* 装飾 */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FFD700] to-transparent" />
              
              <h3 className="text-[#FFD700] font-sans text-xs tracking-widest mb-4 uppercase opacity-80">
                Generated Noise
              </h3>
              
              <div className="prose prose-invert max-w-none">
                <p className="font-serif text-slate-200 leading-loose whitespace-pre-wrap text-lg">
                  {result}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-end">
                <p className="text-slate-500 text-xs font-sans">
                  ※ この回答に正解を求めないでください
                </p>
                <button 
                  onClick={() => setInput("")}
                  className="text-slate-400 hover:text-slate-200 text-sm font-sans underline decoration-slate-600 underline-offset-4 transition-colors"
                >
                  別の悩みで試す
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

