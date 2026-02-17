"use client"

import { useEffect, useState } from "react"

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"envelope" | "opening" | "letter" | "fadeout">("envelope")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1800)
    const t2 = setTimeout(() => setPhase("letter"), 2800)
    const t3 = setTimeout(() => setPhase("fadeout"), 5000)
    const t4 = setTimeout(() => onComplete(), 5600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${phase === "fadeout" ? "opacity-0" : "opacity-100"}`}
      style={{ background: "#FAFAF8" }}
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-[0.08] blur-[100px]" style={{ background: "#d4a0b0" }} />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full opacity-[0.06] blur-[80px]" style={{ background: "#c4909e" }} />
      </div>

      {/* Envelope */}
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: "900px" }}>
        <div
          className={`relative transition-all duration-700 ${phase === "envelope" ? "scale-100" : "scale-[0.88]"}`}
          style={{ width: "280px", height: "190px" }}
        >
          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-[20px]"
            style={{
              background: "linear-gradient(155deg, #f2e4e8, #ebd6dc)",
              boxShadow: "0 24px 64px rgba(180, 150, 165, 0.12), 0 2px 8px rgba(180, 150, 165, 0.06)",
            }}
          />

          {/* Inner fold lines */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
            <div className="absolute bottom-0 left-0 h-[55%] w-[55%]" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.08) 50%)" }} />
            <div className="absolute bottom-0 right-0 h-[55%] w-[55%]" style={{ background: "linear-gradient(-135deg, transparent 50%, rgba(255,255,255,0.08) 50%)" }} />
          </div>

          {/* Flap */}
          <div
            className="absolute top-0 left-0 right-0 overflow-hidden"
            style={{
              height: "50%",
              transformOrigin: "top center",
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: phase !== "envelope" ? "rotateX(-180deg)" : "rotateX(0deg)",
              zIndex: phase !== "envelope" ? 0 : 2,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #ebd6dc, #f2e4e8)",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              }}
            />
          </div>

          {/* Wax seal */}
          <div
            className={`absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${phase !== "envelope" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "#c4a0ae", boxShadow: "0 2px 6px rgba(160, 120, 135, 0.25)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          {/* EchoHeart text on envelope */}
          <div className={`absolute bottom-6 left-0 right-0 text-center transition-all duration-500 ${phase !== "envelope" ? "opacity-0" : "opacity-100"}`}>
            <p className="font-serif text-lg font-light italic tracking-[0.2em]" style={{ color: "#8a6b74" }}>
              EchoHeart
            </p>
          </div>
        </div>

        {/* Letter rising from envelope */}
        <div
          className="absolute top-0 flex items-center justify-center rounded-2xl transition-all duration-1000 ease-out"
          style={{
            width: "250px",
            minHeight: "120px",
            background: "#fff",
            border: "1px solid #ebe3e5",
            boxShadow: "0 16px 48px rgba(180, 150, 165, 0.1)",
            opacity: phase === "letter" || phase === "fadeout" ? 1 : 0,
            transform: phase === "letter" || phase === "fadeout" ? "translateY(-100px)" : "translateY(0px)",
            zIndex: 5,
          }}
        >
          <div className="px-8 py-6 text-center">
            <p className="font-serif text-sm font-light leading-relaxed tracking-wide" style={{ color: "#6b5c60" }}>
              亲爱的：<br /><br />
              并不是所有的相遇都需要巧合。<br />
              有时，宿命只是你在填写这些问题时，笔尖不经意间的停顿；<br />
              是你在输入那个名字时，心跳漏掉的那一拍。<br />
              我们根据你留在时空里的 MBTI 印记、生辰的纬度，以及那 40 个关于爱的抉择，锁定了这个宇宙中唯一能与你产生共振的坐标。<br />
              接下来的内容，是你与 ㅇㅇ 之间，跨越了逻辑与概率的最终回响。
            </p>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <p
        className={`mt-32 font-sans text-[9px] font-light tracking-[0.35em] uppercase transition-all duration-500 ${phase === "envelope" ? "opacity-30" : "opacity-0"}`}
        style={{ color: "#aaa" }}
      >
        EchoHeart
      </p>
    </div>
  )
}
