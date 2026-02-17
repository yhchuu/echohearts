"use client"

import { useState, useCallback, useRef, useEffect ,Suspense} from "react"
import { SplashScreen } from "@/components/splash-screen"
import { InputForm, type UserInfo } from "@/components/input-form"
import { QuizCard } from "@/components/quiz-card"
import { Results } from "@/components/results"
import { FloatingHearts, Sparkles, PatternBackground, ProgressBar } from "@/components/decorations"
import { quizQuestions } from "@/lib/quiz-data"
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'


type Phase = "splash" | "input" | "quiz" | "loading" | "results"

export function EchoHeartApp() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // 【关键修改 1】：把这个 Hook 挪到这里，它是 React 的“规矩”
  const searchParams = useSearchParams() 
  // 【关键修改 2】：直接从 searchParams 拿到 code，不需要 useEffect 赋值
  const code = searchParams.get("code")

  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<Phase>("splash")
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [loadingStep, setLoadingStep] = useState(0)
  const [isCodeValid, setIsCodeValid] = useState(false)

  useEffect(() => {
    const checkCode = async () => {
      if (!code) {
        alert("请先购买测试哦～")
        return
      }

      // 这里写你之前校验 code 的逻辑
      const { data, error } = await supabase
        .from("codes")
        .select("*")
        .eq("code", code)
        .single()

      if (error || !data) {
        alert("邀请码无效")
        return
      }

      if (data.used) {
        alert("这个邀请码已经使用过了")
        return
      }

      setIsCodeValid(true)
    }

    checkCode()
  }, [code])



  
  // --- 关键修改：定义两个对象状态 ---
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [idolInfo, setIdolInfo] = useState<UserInfo | null>(null)
  const timeRef = useRef("")

  const onSplashDone = useCallback(() => {
  // 如果锁解开了（验证通过），才允许进入
  if (isCodeValid) {
    setPhase("input")
  }
  // 如果没通过（isCodeValid是false），这里什么都不做，就卡在开屏页，不让他进
}, [isCodeValid])

  // --- 关键修改：存储完整对象而非仅姓名 ---
  const onInputDone = useCallback((u: UserInfo, idol: UserInfo) => {
    setUserInfo(u)
    setIdolInfo(idol)
    setPhase("quiz")
  }, [])

  const onAnswer = useCallback(async (idx: number) => {
    const next = [...answers, idx]
    setAnswers(next)

    if (qIndex < quizQuestions.length - 1) {
      setQIndex(prev => prev + 1)
    } else {
      const now = new Date()
      timeRef.current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      // ✅ 标记这个code已经被使用
if (code) {
  await supabase
    .from('codes')
    .update({ used: true })
    .eq('code', code)
}

      setPhase("loading")
      setLoadingStep(0)
      setTimeout(() => setPhase("results"), 2600)
    }
  }, [answers, qIndex])

  // “AI 正在分析”三行提示的逐步出现
  useEffect(() => {
    if (phase !== "loading") return
    setLoadingStep(0)
    const t1 = setTimeout(() => setLoadingStep(1), 400)
    const t2 = setTimeout(() => setLoadingStep(2), 1100)
    const t3 = setTimeout(() => setLoadingStep(3), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [phase, idolInfo])
  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {
      // 浏览器禁止自动播放时不会报错
    })
  }
}, [])


  return (
    <main className="relative min-h-screen overflow-x-hidden">
    <audio ref={audioRef} src="/music/bgm.mp3" loop />
      <PatternBackground />
      <FloatingHearts />
      <Sparkles />

      <div className="relative z-10">
      <button
  onClick={() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }}
  className="fixed right-4 top-4 z-50 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-[11px] tracking-widest text-gray-700 shadow-sm border border-white/40 transition hover:bg-white/90"
>
  {playing ? "BGM ON" : "BGM OFF"}
</button>

        {phase === "splash" && <SplashScreen onComplete={onSplashDone} />}
        {phase === "input" && <InputForm onComplete={onInputDone} />}

        {phase === "quiz" && (
          <>
            <ProgressBar current={qIndex + 1} total={quizQuestions.length} />
            <div className="pt-10">
              <QuizCard
                key={qIndex}
                question={quizQuestions[qIndex]}
                questionNum={qIndex + 1}
                totalQuestions={quizQuestions.length}
                onAnswer={onAnswer}
                onPrevious={() => setQIndex(prev => Math.max(0, prev - 1))}

              />
            </div>
          </>
        )}

        {phase === "loading" && (
          <div className="flex min-h-screen flex-col items-center justify-center px-6">
            <div className="mb-8 animate-heart-beat">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#d4a0b0" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="space-y-2 text-center">
              {loadingStep >= 1 && (
                <p className="font-sans text-xs text-gray-600 animate-fade-in">
                  正在连接半岛卫星...
                </p>
              )}
              {loadingStep >= 2 && idolInfo && (
                <p
                  className="font-sans text-xs text-gray-600 animate-fade-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  正在分析 {idolInfo.name} 的 MBTI 动态...
                </p>
              )}
              {loadingStep >= 3 && (
                <p
                  className="font-sans text-xs text-gray-600 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  正在检索 9.13MHz 信号...
                </p>
              )}
            </div>
            <div className="mt-4 h-[2px] w-40 overflow-hidden rounded-full" style={{ background: "#EDEBE9" }}>
              <div
                className="animate-shimmer h-full rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #d4a0b0, transparent)" }}
              />
            </div>
          </div>
        )}

        {/* --- 关键修改：传递完整参数并使用非空断言 --- */}
        {phase === "results" && userInfo && idolInfo && (
          <Results 
            answers={answers} 
            userInfo={userInfo} 
            idolInfo={idolInfo} 
            completionTime={timeRef.current} 
          />
        )}
      </div>
    </main>
  )
}
export default function WrappedApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EchoHeartApp />
    </Suspense>
  )
}
