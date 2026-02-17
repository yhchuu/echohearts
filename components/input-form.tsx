"use client"

import { useState } from "react"

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
]

export interface UserInfo {
  birthday: string
  mbti: string
  name?: string
}

interface InputFormProps {
  onComplete: (userData: UserInfo, idolData: UserInfo) => void
}

export function InputForm({ onComplete }: InputFormProps) {
  const [step, setStep] = useState<"user" | "idol">("user")
  const [userData, setUserData] = useState<UserInfo>({ birthday: "", mbti: "" })
  const [idolData, setIdolData] = useState<UserInfo>({ birthday: "", mbti: "", name: "" })
  const [animating, setAnimating] = useState(false)

  const currentData = step === "user" ? userData : idolData
  const setCurrentData = step === "user" ? setUserData : setIdolData

  const isUserValid = userData.birthday && userData.mbti
  const isIdolValid = idolData.birthday && idolData.mbti && idolData.name

  const handleNext = () => {
    if (step === "user" && !isUserValid) return
    if (step === "idol" && !isIdolValid) return

    if (step === "user") {
      setAnimating(true)
      setTimeout(() => {
        setStep("idol")
        setAnimating(false)
      }, 400)
    } else {
      onComplete(userData, idolData)
    }
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-6 py-16 transition-opacity duration-400 ${animating ? "opacity-0" : "opacity-100"}`}>
      {/* Header */}
      <div className="mb-8 animate-fade-in text-center">
        <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.35em]" style={{ color: "#b8a8ae" }}>
          {step === "user" ? "Step 01" : "Step 02"}
        </p>
        <h2 className="font-serif text-2xl font-light tracking-wide" style={{ color: "#2D2D2D" }}>
          {step === "user" ? "About You" : "About Them"}
        </h2>
        <p className="mt-2 font-sans text-xs font-light" style={{ color: "#999" }}>
          {step === "user" ? "Only the stars will remember" : "The name that makes your heart skip"}
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm animate-slide-up rounded-2xl p-7"
        style={{
          animationDelay: "0.1s",
          background: "#fff",
          boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
          border: "1px solid #f0eced",
        }}
      >
        {/* Idol name field */}
        {step === "idol" && (
          <div className="mb-6">
            <label className="mb-2 block font-sans text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#999" }}>
              Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Their name"
              value={idolData.name || ""}
              onChange={(e) => setIdolData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all focus:ring-1"
              style={{
                background: "#FAFAF8",
                border: "1px solid #ece6e8",
                color: "#2D2D2D",
              }}
            />
          </div>
        )}

        {/* Birthday */}
        <div className="mb-6">
          <label className="mb-2 block font-sans text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#999" }}>
            Birthday
          </label>
          <input
            type="date"
            min="1980-01-01"
            max="2026-12-31"
            value={currentData.birthday}
            onChange={(e) => setCurrentData(prev => ({ ...prev, birthday: e.target.value }))}
            className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all focus:ring-1"
            style={{
              background: "#FAFAF8",
              border: "1px solid #ece6e8",
              color: currentData.birthday ? "#2D2D2D" : "#bbb",
            }}
          />
        </div>

        {/* MBTI */}
        <div className="mb-7">
          <label className="mb-3 block font-sans text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#999" }}>
            MBTI
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map((type) => {
              const active = currentData.mbti === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCurrentData(prev => ({ ...prev, mbti: type }))}
                  className="rounded-lg py-2.5 font-sans text-[11px] font-medium tracking-wide transition-all duration-200 active:scale-95"
                  style={{
                    background: active ? "#d4a0b0" : "#FAFAF8",
                    color: active ? "#fff" : "#777",
                    border: `1px solid ${active ? "#d4a0b0" : "#ece6e8"}`,
                  }}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={step === "user" ? !isUserValid : !isIdolValid}
          className="w-full rounded-xl py-3.5 font-sans text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 active:scale-[0.97] disabled:opacity-20"
          style={{ background: "#6f6f6f", color: "#fff" }}
        >
          {step === "user" ? "Continue" : "Begin"}
        </button>
      </div>

      {/* Step indicator */}
      <div className="mt-10 flex gap-3" aria-hidden="true">
        <div
          className="rounded-full transition-all duration-400"
          style={{
            width: step === "user" ? "20px" : "6px",
            height: "6px",
            background: step === "user" ? "#c4a0ae" : "#ddd",
          }}
        />
        <div
          className="rounded-full transition-all duration-400"
          style={{
            width: step === "idol" ? "20px" : "6px",
            height: "6px",
            background: step === "idol" ? "#c4a0ae" : "#ddd",
          }}
        />
      </div>
    </div>
  )
}
