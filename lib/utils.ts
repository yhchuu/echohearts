import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据用户 MBTI + 偶像 MBTI 判断恋爱类型
 */
export function getLoveType(userMbti: string, idolMbti: string) {
  // 统一转大写避免大小写问题
  const user = (userMbti || "").toUpperCase()
  const idol = (idolMbti || "").toUpperCase()

  // ① 冷感理性系（只要有一方是 T 就触发）
  if (user.includes("T") || idol.includes("T")) return "cool"

  // ② 治愈陪伴系（NF）
  if (user.includes("N") && user.includes("F")) return "healing"

  // ③ 甜系热恋（EP）
  if (user.includes("E") && user.includes("P")) return "sweet"

  // ④ 稳定未来型（SJ）
  if (user.includes("S") && user.includes("J")) return "future"

  // ⑤ 默认浪漫型
  return "romantic"
}