"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // 時間フォーマット関数 (MM:SS) - 機能的なので Sans-serif で表示
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full bg-[#0B1221] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
      {/* 背景の装飾（微かな光） */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent opacity-50" />

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col gap-4 relative z-10">
        {/* タイトルエリア */}
        {title && (
          <div className="text-slate-200 font-serif text-lg tracking-wide mb-2 opacity-90">
            {title}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* 再生/停止ボタン */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FFD700] text-[#020817] hover:bg-[#FFD700]/90 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] font-sans"
          >
            {isPlaying ? (
              <Pause size={20} fill="#020817" />
            ) : (
              <Play size={20} fill="#020817" className="ml-1" />
            )}
          </button>

          {/* プログレスバーエリア */}
          <div className="flex-1 flex flex-col justify-center gap-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFD700] hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_#FFD700]"
              style={{
                background: `linear-gradient(to right, #FFD700 ${progress}%, #1e293b ${progress}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 font-sans tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 音量など補助コントロール */}
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-[#FFD700] transition-colors p-2 font-sans"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

