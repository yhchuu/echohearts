"use client"

import React, { useState, useEffect } from "react"

// --- 完整 78 张塔罗牌数据 ---
const MAJOR_ARCANA = [
  "愚者 (The Fool)", "魔术师 (The Magician)", "女祭司 (The High Priestess)", "女皇 (The Empress)",
  "皇帝 (The Emperor)", "教皇 (The Hierophant)", "恋人 (The Lovers)", "战车 (The Chariot)",
  "力量 (Strength)", "隐士 (The Hermit)", "命运之轮 (Wheel of Fortune)", "正义 (Justice)",
  "倒吊人 (The Hanged Man)", "死神 (Death)", "节制 (Temperance)", "恶魔 (The Devil)",
  "高塔 (The Tower)", "星星 (The Star)", "月亮 (The Moon)", "太阳 (The Sun)",
  "审判 (Judgement)", "世界 (The World)"
]

const SUITS = ["权杖 (Wands)", "圣杯 (Cups)", "宝剑 (Swords)", "星币 (Pentacles)"]
const RANKS = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Page (侍从)", "Knight (骑士)", "Queen (王后)", "King (国王)"]

const MINOR_ARCANA = SUITS.flatMap(suit => RANKS.map(rank => `${suit} ${rank}`))
const FULL_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA]

type Card = {
  name: string
  isReversed: boolean
}

type Phase = "idle" | "input" | "shuffling" | "draw1" | "draw2" | "draw3" | "result"

export function TarotReading() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [question, setQuestion] = useState("")
  const [drawnCards, setDrawnCards] = useState<Card[]>([])
  // Fisher–Yates 洗牌算法（真正随机）
function shuffle(array: string[]) {
  const arr = [...array]

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

  // 真实的洗牌与抽牌逻辑
  const drawCards = () => {
    // 打乱 78 张牌
    const shuffled = shuffle(FULL_DECK)
    // 抽取前 3 张，并随机赋予正逆位
    const selected = shuffled.slice(0, 3).map(cardName => ({
      name: cardName,
      isReversed: Math.random() > 0.5,
    }))
    setDrawnCards(selected)
  }

  // 动画流程控制
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (phase === "shuffling") {
      timer = setTimeout(() => setPhase("draw1"), 1200)
    } else if (phase === "draw1") {
      timer = setTimeout(() => setPhase("draw2"), 1200)
    } else if (phase === "draw2") {
      timer = setTimeout(() => setPhase("draw3"), 1200)
    } else if (phase === "draw3") {
      timer = setTimeout(() => setPhase("result"), 1200)
    }
    return () => clearTimeout(timer)
  }, [phase])

  const handleStartDraw = () => {
    if (!question.trim()) return
    drawCards()
    setPhase("shuffling")
  }

  const formatCard = (card: Card) => {
    return `${card.name} - ${card.isReversed ? "逆位 (Reversed)" : "正位 (Upright)"}`
  }

  // UI - 初始状态
  if (phase === "idle") {
    return (
      <div className="mt-8 flex w-full max-w-sm flex-col items-center animate-fade-in">
        <button
          onClick={() => setPhase("input")}
          className="rounded-full px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
          style={{ background: "#f0e4e7", color: "#8a6d76", border: "1px solid #f0eced" }}
        >
          ✦ 开启额外塔罗占卜 ✦
        </button>
      </div>
    )
  }

  // UI - 输入问题阶段
  if (phase === "input") {
    return (
      <section className="mt-8 w-full max-w-sm animate-slide-up">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
        >
          <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: "#b8a8ae" }}>
            Tarot Reading
          </p>
          <h3 className="mb-6 font-serif text-lg font-light" style={{ color: "#2D2D2D" }}>
            在心中默念你的问题
          </h3>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：我们未来的发展会怎样？"
            className="mb-6 w-full border-b pb-2 text-center font-sans text-sm outline-none placeholder:text-gray-300"
            style={{ borderBottomColor: "#f0eced", color: "#555", background: "transparent" }}
          />
          <button
            onClick={handleStartDraw}
            disabled={!question.trim()}
            className="rounded-full px-6 py-2 font-sans text-xs uppercase tracking-widest disabled:opacity-50 transition-opacity"
            style={{ background: "#2D2D2D", color: "#fff" }}
          >
            开始抽牌
          </button>
        </div>
      </section>
    )
  }

  // UI - 抽牌动画阶段
  if (phase !== "result") {
    return (
      <section className="mt-8 w-full max-w-sm animate-fade-in">
        <div
          className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl p-8 text-center"
          style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
        >
          {phase === "shuffling" && (
            <p className="animate-pulse font-serif text-sm tracking-widest" style={{ color: "#999" }}>
              正在洗牌...
            </p>
          )}

          {(phase === "draw1" || phase === "draw2" || phase === "draw3") && (
            <div className="w-full space-y-4 text-left">
              <p className="mb-4 text-center font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: "#b8a8ae" }}>
                Drawing Cards...
              </p>
              
              <div className="animate-fade-in border-l-2 pl-3" style={{ borderColor: "#f0e4e7" }}>
                <span className="block font-sans text-[10px] uppercase" style={{ color: "#999" }}>第一张</span>
                <span className="font-serif text-sm" style={{ color: "#555" }}>{formatCard(drawnCards[0])}</span>
              </div>

              {phase !== "draw1" && (
                <div className="animate-fade-in border-l-2 pl-3" style={{ borderColor: "#f0e4e7" }}>
                  <span className="block font-sans text-[10px] uppercase" style={{ color: "#999" }}>第二张</span>
                  <span className="font-serif text-sm" style={{ color: "#555" }}>{formatCard(drawnCards[1])}</span>
                </div>
              )}

              {phase === "draw3" && (
                <div className="animate-fade-in border-l-2 pl-3" style={{ borderColor: "#f0e4e7" }}>
                  <span className="block font-sans text-[10px] uppercase" style={{ color: "#999" }}>第三张</span>
                  <span className="font-serif text-sm" style={{ color: "#555" }}>{formatCard(drawnCards[2])}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  // UI - 最终结果呈现
  return (
    <section className="mt-8 w-full max-w-sm animate-slide-up">
      <div
        className="rounded-2xl p-8"
        style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
      >
        <div className="mb-6 text-center border-b pb-6" style={{ borderColor: "#f0eced" }}>
          <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: "#b8a8ae" }}>
            The Answer
          </p>
          <p className="font-serif text-sm italic leading-relaxed" style={{ color: "#555" }}>
            "{question}"
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <span className="mb-1 block font-sans text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>第一张牌</span>
            <p className="font-serif text-base" style={{ color: "#2D2D2D" }}>{formatCard(drawnCards[0])}</p>
          </div>
          
          <div>
            <span className="mb-1 block font-sans text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>第二张牌</span>
            <p className="font-serif text-base" style={{ color: "#2D2D2D" }}>{formatCard(drawnCards[1])}</p>
          </div>
          
          <div>
            <span className="mb-1 block font-sans text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>第三张牌</span>
            <p className="font-serif text-base" style={{ color: "#2D2D2D" }}>{formatCard(drawnCards[2])}</p>
          </div>
        </div>
      </div>
    </section>
  )
}