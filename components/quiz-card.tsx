"use client"

import { useState } from "react"
// 如果你之前定义了 QuizQuestion 类型在 quiz-data 里，这里可以直接用 any 避免类型报错，或者 import { QuizQuestion } from "@/lib/quiz-data"
// 为了防止报错，这里我暂时用 any，保证能跑起来
interface QuizCardProps {
  question: any 
  questionNum: number
  totalQuestions: number
  onAnswer: (answerIndex: number) => void,
   onPrevious: () => void  // 👈 新增这一行
}

const SCALE_LABELS = [
  "Strongly Agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly Disagree",
]

export function QuizCard({ question, questionNum, totalQuestions, onAnswer, onPrevious }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  const handleSelect = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    // 这里的延时是为了展示点击动画
    setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onAnswer(index)
        setSelected(null) // 重置状态给下一题
        setIsExiting(false)
      }, 400)
    }, 400)
  }

  return (
    <div className={`flex min-h-[50vh] flex-col justify-center px-6 py-8 transition-all duration-400 ${isExiting ? "translate-y-3 opacity-0" : "opacity-100"}`}>
      
      {/* 1. 题号显示 (保留你的灰色小字样式) */}
      <div className="mb-6 animate-fade-in text-center">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: "#b8a8ae" }}>
          {questionNum} / {totalQuestions}
        </span>
      </div>

      {/* 2. 题目文字 (自动判断是 statement 还是 question) */}
      <h3
        className="mb-12 animate-fade-in text-center font-serif text-xl font-light leading-relaxed"
        style={{ color: "#2D2D2D", animationDelay: "0.1s" }}
      >
        {question.text}
      </h3>

      {/* 3. 核心区域：判断是程度题还是选择题 */}
      {question.type === "scale" ? (
        // 程度题：颜色完全按你给的代码来
        <div className="flex w-full flex-col gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {SCALE_LABELS.map((label, index) => {
            const isSelected = selected === index
            const isOther = selected !== null && !isSelected
            
            // 你的核心样式数据
            const heights = [56, 48, 40, 48, 56]
            const baseColors = ["#d4a0b0", "#dbb8c2", "#ccc", "#a8adb5", "#8e9298"]
            const activeColors = ["#c48a9a", "#c9a0ac", "#999", "#8a8f96", "#6e7278"]

            return (
              <button
                key={label}
                type="button"
                onClick={() => handleSelect(index)}
                className="group relative w-full overflow-hidden rounded-2xl transition-all duration-300 active:scale-[0.98]"
                style={{
                  height: `${heights[index]}px`,
                  background: isSelected ? activeColors[index] : "#fff",
                  border: `1px solid ${isSelected ? activeColors[index] : "#eee"}`,
                  opacity: isOther ? 0.25 : 1,
                  boxShadow: isSelected ? `0 4px 20px ${activeColors[index]}33` : "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  className="font-sans text-xs font-medium tracking-wider transition-colors duration-300"
                  style={{
                    // 被选中的文字为白色，未选中为 baseColors
                    color: isSelected ? "#fff" : baseColors[index],
                  }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        // 选择题：选中时改为浅灰色方案
        <div className="flex w-full flex-col gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {question.options?.map((option: string, index: number) => {
            const isSelected = selected === index
            const isOther = selected !== null && !isSelected

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                className="w-full rounded-2xl px-5 py-4 text-left transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: isSelected ? "#f5f5f5" : "#fff",
                  color: "#555",
                  border: `1px solid ${isSelected ? "#d4d4d4" : "#eee"}`,
                  opacity: isOther ? 0.25 : 1,
                  boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <span className="font-sans text-sm font-normal leading-relaxed">{option}</span>
              </button>
            )
          })}
          
        </div>
        

      )}
        {/* 在第 124 行的 </div> 之前插入以下代码 */}
      {questionNum > 1 && (
        <div className="mt-8 flex w-full justify-start px-2">
          <button
            onClick={onPrevious}
            className="group flex items-center gap-1.5 opacity-40 transition-all hover:opacity-100"
          >
            <span className="font-sans text-lg leading-none pb-0.5">←</span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em]">
              Back
            </span>
          </button>
        </div>
      )}
    

    </div>
  )
}