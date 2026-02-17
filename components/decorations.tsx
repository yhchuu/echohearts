"use client"

import { useEffect, useState } from "react"

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number }[]>([])

  useEffect(() => {
    const generated = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 10 + 6,
    }))
    setHearts(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-drift"
          style={{
            left: `${h.x}%`,
            top: `${60 + Math.random() * 30}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
            opacity: 0.06 + Math.random() * 0.06,
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="#f776a7" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export function Sparkles() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

  useEffect(() => {
    const generated = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setSparkles(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="animate-sparkle absolute font-serif"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            fontSize: `${5 + Math.random() * 3}px`,
            color: "#d4bcc4",
          }}
        >
          +
        </div>
      ))}
    </div>
  )
}

export function PatternBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: "#FAFAF8" }} />
      <div className="bg-stripes absolute inset-0" />
      {/* Subtle warm blush glow - top right */}
      <div
        className="absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-[0.07] blur-[100px]"
        style={{ background: "#d4a0b0" }}
      />
      {/* Subtle warm blush glow - bottom left */}
      <div
        className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full opacity-[0.05] blur-[80px]"
        style={{ background: "#c4909e" }}
      />
    </div>
  )
}

export function LaceDivider() {
  return (
    <div className="my-8 flex w-full max-w-sm items-center justify-center gap-3" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #e0d4d8)" }} />
      <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4b8c0" opacity={0.5}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #e0d4d8, transparent)" }} />
    </div>
  )
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 px-6 pt-4 pb-3"
      style={{ background: "rgba(250, 250, 248, 0.92)", backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: "#EDEBE9" }}>
          <div
            className="progress-fill absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-sans text-[10px] font-medium tabular-nums tracking-widest" style={{ color: "#aaa" }}>
          {current}/{total}
        </span>
      </div>
    </div>
  )
}
