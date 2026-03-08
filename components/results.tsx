"use client"
import {
  interactionScenesByType,
  petsByType,
  identityCardsByType,
  crowdThoughtsByType,
  playlistByType,
  activitiesByType,
  matchTexts,
} from "@/lib/quiz-data"

import { getLoveType } from "@/lib/utils"

import React, { useState, useEffect, useCallback } from "react"
import { LaceDivider } from "./decorations"
import { type UserInfo } from "./input-form"
import { TarotReading } from "./tarot-reading"

interface ResultsProps {
  answers: number[]
  userInfo: UserInfo
  idolInfo: UserInfo
  completionTime: string
}
function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}
function pick<T>(arr: T[], seed: number): T {
  if (!arr || arr.length === 0) return {} as T
  return arr[Math.abs(seed) % arr.length]
}

const spotifyUrl = (title: string) => `https://open.spotify.com/search/${encodeURIComponent(title)}`

export function Results({ answers, userInfo, idolInfo, completionTime }: ResultsProps) {
  const [matchPercent, setMatchPercent] = useState(0)
  // 第 50 行左右新增：这会让每次进入页面时，抽取的剧情序号都发生偏移
const [plotOffset] = useState(() => Math.floor(Math.random() * 10));
  const [counted, setCounted] = useState(false)
  const [showKakao, setShowKakao] = useState(false)

  const seedBase = answers.reduce((a, b) => a + b, 0)
  const mbtiSeed =
    (userInfo.mbti?.charCodeAt(0) ?? 0) +
    (userInfo.mbti?.charCodeAt(1) ?? 0) +
    (userInfo.mbti?.charCodeAt(2) ?? 0) +
    (userInfo.mbti?.charCodeAt(3) ?? 0)

  const birthSeed = (() => {
    const parse = (d?: string) => {
      if (!d) return 0
      const dt = new Date(d)
      if (Number.isNaN(dt.getTime())) return 0
      return dt.getMonth() * 31 + dt.getDate()
    }
    return parse(userInfo.birthday) + parse(idolInfo.birthday)
  })()

  const seed = seedBase + mbtiSeed + birthSeed
  const finalPercent = 60 + (seed % 40) // 60–99


  const matchText =
    matchTexts.find(m => finalPercent >= m.min && finalPercent <= m.max)?.text || matchTexts[2]?.text || ""
  const loveType = getLoveType(userInfo.mbti, idolInfo.mbti)
  // 根据 MBTI 得到恋爱类型池
  const kakaoLines = [
  "오늘 하루도 너 생각밖에 안 했어ㅎㅎ",
  "이런 말 자꾸 하면 좀 부끄럽지만… 너 없으면 안 될 것 같아^^",
  "지금 뭐해? 나랑 같은 하늘 보고 있으면 좋겠다ㅎㅎ",
  "아까부터 계속 네 생각만 나서 집중이 안 돼… 책임져^^",
  "너 오늘도 예뻤어. 말 안 하려 했는데 그냥 하고 싶어서ㅎㅎ",
  "나 요즘 너 때문에 자꾸 웃게 돼. 이거 좋은 거 맞지?",
  "피곤했는데 네 생각하니까 갑자기 힘 나네ㅎㅎ 단순하지?",
  "너랑 통화하고 싶은데… 지금 괜찮아?",
  "괜히 네 이름 한 번 더 불러보고 싶어지는 밤이야",
  "오늘 있었던 일 다 말해주고 싶다. 제일 먼저 너한테ㅎㅎ",
  "이거 비밀인데… 나 너 좋아하는 것 같아^^",
  "너랑 같이 있으면 시간 너무 빨리 가. 나만 그래?",
  "오늘따라 네 목소리 듣고 싶다… 그냥 그래ㅎㅎ",
  "다른 건 몰라도 너 웃는 건 계속 보고 싶어",
  "너한테 잘 보이고 싶은 거, 나만 이런 거 아니지?"
]
function pickTwoLines(arr: string[]) {
  if (!arr || arr.length === 0) return []
  if (arr.length === 1) return [arr[0]]

  const first = Math.floor(Math.random() * arr.length)

  let second = Math.floor(Math.random() * arr.length)

  while (second === first) {
    second = Math.floor(Math.random() * arr.length)
  }

  return [arr[first], arr[second]]
}
 const base = seed   // 👉 统一随机源

const petList = petsByType[loveType] || []
const thoughtList = crowdThoughtsByType[loveType] || []

const loveStory = pick(interactionScenesByType[loveType], base + plotOffset + 2)

const identity = pick(identityCardsByType[loveType], (answers[3] ?? 0) + base + plotOffset)

const chosenPet = pick(petList, (answers[1] ?? 0) + base + plotOffset)


// 保持你原来的这行不变，不动 KKT
const kakaoMessage = pickTwoLines(kakaoLines)

const chosenActivity = pick(
  activitiesByType[loveType],
  (answers[4] ?? 0) + base + plotOffset
)

const crowdThought = pick(thoughtList, (answers[0] ?? 0) + base + plotOffset)

const playlistList = playlistByType[loveType] || []

const recommendedSongs =
  playlistList.length > 0
    ? Array.from({ length: 3 }, (_, i) => {
        // 这里也加入 plotOffset 偏移
        return playlistList[(base + plotOffset + i) % playlistList.length]
      })
    : []


  const animateMatch = useCallback(() => {
    let current = 0
    const interval = setInterval(() => {
      current += 1
      if (current >= finalPercent) {
        clearInterval(interval)
        setCounted(true)
        setTimeout(() => setShowKakao(true), 600)
      }
      setMatchPercent(current)
    }, 25)
    return () => clearInterval(interval)
  }, [finalPercent])

  useEffect(() => {
    const t = setTimeout(() => animateMatch(), 500)
    return () => clearTimeout(t)
  }, [animateMatch])

  return (
    <div className="flex min-h-screen flex-col items-center px-5 pb-28 pt-10">
      {/* --- Match Percentage（沿用原模板样式，但文案中文） --- */}
      <section className="w-full max-w-sm animate-fade-in">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
        >
          <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
            <svg className="absolute" width="96" height="96" viewBox="0 0 24 24" fill="#f0e4e7" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg
              className={`absolute ${counted ? "animate-heart-beat" : ""}`}
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="#d4a0b0"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span
              className="relative z-10 font-sans text-lg font-semibold tabular-nums"
              style={{ color: "#fff" }}
            >
              {matchPercent}%
            </span>
          </div>

          <p
            className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.25em]"
            style={{ color: "#b8a8ae" }}
          >
            Soul Frequency
          </p>
          <h3 className="mb-3 font-serif text-lg font-light" style={{ color: "#2D2D2D" }}>
            {userInfo.name} {"&"} {idolInfo.name}
          </h3>
          <p
            className="font-sans text-xs font-light leading-relaxed"
            style={{ color: "#999" }}
          >
            {matchText}
          </p>

          {counted && (
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(i => (
                <svg
                  key={i}
                  className="animate-drift"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="#d4a0b0"
                  style={{ animationDelay: `${i * 0.4}s`, opacity: 0.3 + i * 0.1 }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </section>

      <LaceDivider />

      {/* 结果卡片：英文标题 + 中文内容 */}
      <ResultCard delay="0.2s" label="When he saw you">
        <p
          className="font-serif text-base font-light italic leading-relaxed"
          style={{ color: "#555" }}
        >
          {crowdThought}
        </p>
      </ResultCard>

      <ResultCard delay="0.35s" label="You would adopt">
        <p className="font-sans text-sm leading-relaxed" style={{ color: "#555" }}>
          {chosenPet}
        </p>
      </ResultCard>

      <ResultCard delay="0.5s" label="Your song">
        <ul className="space-y-2 text-left">
          {recommendedSongs.map((title, idx) => (
            <li key={idx} className="flex items-center justify-between gap-2">
              <span className="font-sans text-sm" style={{ color: "#555" }}>
                {title}
              </span>
              <a
                href={spotifyUrl(title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: "#f3f3f3", color: "#666" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard delay="0.65s" label="He Wants to Do With You">
        <p className="font-sans text-sm leading-relaxed" style={{ color: "#555" }}>
          {chosenActivity}
        </p>
      </ResultCard>

      <ResultCard delay="0.8s" label="LOVE STORY">
        <p className="font-sans text-sm leading-relaxed" style={{ color: "#555" }}>
          {loveStory}
        </p>
      </ResultCard>

      <LaceDivider />

      {/* 身份卡：标题英文，内容中文 */}
      <section className="w-full max-w-sm animate-slide-up" style={{ animationDelay: "1s" }}>
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
        >
          <div className="px-6 py-3 text-center" style={{ background: "#FAFAF8", borderBottom: "1px solid #f0eced" }}>
            <p
              className="font-sans text-[9px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#b8a8ae" }}
            >
              Parallel Universe ID
            </p>
          </div>
          <div className="px-6 py-6 text-center">
            <p className="font-sans text-xs font-light leading-relaxed" style={{ color: "#999" }}>
              {identity}
            </p>
          </div>
        </div>
      </section>

      <LaceDivider />

      <p className="font-serif text-xs font-light tracking-[0.3em]" style={{ color: "#ccc" }}>
        EchoHeart
      </p>
      <TarotReading />

      {/* KakaoTalk 弹窗：韩语非敬语，两三句 + 用户可回复一条 */}
      {showKakao && (
        <KakaoTalkPopup
  idolName={idolInfo.name ?? ""}
  lines={kakaoMessage}
  completionTime={completionTime}
  onClose={() => setShowKakao(false)}
/>

      )}
    </div>
  )
}

function ResultCard({
  delay,
  label,
  children,
}: {
  delay: string
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-5 w-full max-w-sm animate-slide-up" style={{ animationDelay: delay }}>
      <div
        className="rounded-2xl p-6"
        style={{ background: "#fff", boxShadow: "0 2px 24px rgba(0,0,0,0.04)", border: "1px solid #f0eced" }}
      >
        <p
          className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.25em]"
          style={{ color: "#b8a8ae" }}
        >
          {label}
        </p>
        {children}
      </div>
    </section>
  )
}

function KakaoTalkPopup({
  idolName,
  lines,
  completionTime,
  onClose,
}: {
  idolName: string
  lines: string[]
  completionTime: string
  onClose: () => void
}) {
  const today = new Date()
  const dateText = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const [userMsg, setUserMsg] = useState("")
  const [sent, setSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 20)
  }, [])


  const handleSend = () => {
    if (!userMsg.trim()) return
    setSent(true)
  }
  

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
  className={`w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
    mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
  }`}

        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ background: "#B2C7D9" }}>
          <button type="button" onClick={onClose} aria-label="Back" style={{ color: "#3D4A55" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <p className="font-sans text-sm font-semibold" style={{ color: "#3D4A55" }}>
            {idolName}
          </p>
          <div className="flex items-center gap-3" style={{ color: "#3D4A55" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </div>
        </div>

        {/* Date */}
        <div className="flex justify-center py-2.5" style={{ background: "#B2C7D9" }}>
          <div className="rounded-full px-3.5 py-1" style={{ background: "rgba(0,0,0,0.08)" }}>
            <p className="font-sans text-[10px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              {dateText}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 p-4" style={{ background: "#B2C7D9", minHeight: "240px" }}>
  {lines.map((text, idx) => (
    <ChatBubbleLeft key={idx} name={idolName} text={text} time={completionTime} />
  ))}

          {/* User reply */}
          {sent && userMsg.trim() && (
            <div className="flex flex-row-reverse items-end gap-2">
              <div className="flex flex-col items-end">
                <div
                  className="rounded-2xl rounded-br-sm px-3.5 py-2.5"
                  style={{ background: "#FEE500" }}
                >
                  <p className="font-sans text-sm" style={{ color: "#3D3D3D" }}>
                    {userMsg}
                  </p>
                </div>
                <p className="mt-1 font-sans text-[10px]" style={{ color: "rgba(0,0,0,0.3)" }}>
                  {completionTime}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ background: "#fff", borderTop: "1px solid #eee" }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center" style={{ color: "#aaa" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          {/* 第 423 行开始替换 */}
<div className="relative flex-1">
  <input
    type="text"
    placeholder="Reply..."
    value={userMsg}
    onChange={e => setUserMsg(e.target.value)}
    onKeyDown={e => e.key === "Enter" && handleSend()}
    disabled={sent}
    className="w-full rounded-full px-4 py-2 font-sans text-xs outline-none disabled:opacity-50"
    style={{ background: "#F5F5F5", color: "#333" }}
  />
  {/* ✨ 新增光标：只有在没输入内容且没发送时显示 */}
  {!userMsg && !sent && (
    <span className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-[1.5px] -translate-y-1/2 animate-pulse bg-gray-400"></span>
  )}
</div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sent || !userMsg.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-30"
            style={{ background: "#FEE500" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#3D3D3D">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatBubbleLeft({ name, text, time }: { name: string; text: string; time: string }) {
  return (
    <div className="flex items-end gap-2">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ background: "#f0dce2" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#c4a0ae" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div>
        <p
          className="mb-1 font-sans text-[10px] font-medium"
          style={{ color: "rgba(0,0,0,0.45)" }}
        >
          {name}
        </p>
        <div
          className="rounded-2xl rounded-bl-sm px-3.5 py-2.5"
          style={{ background: "#fff" }}
        >
          <p className="font-sans text-sm leading-relaxed" style={{ color: "#3D3D3D" }}>
            {text}
          </p>

        </div>
        <p className="mt-1 font-sans text-[10px]" style={{ color: "rgba(0,0,0,0.3)" }}>
          {time}
        </p>
      </div>
    </div>
  )
}
