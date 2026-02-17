import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getLoveType(userMbti: string, idolMbti: string) {
  // 用户主性格
  if (userMbti.includes("N") && userMbti.includes("F")) return "healing"

  if (userMbti.includes("E") && userMbti.includes("P")) return "sweet"

  if (userMbti.includes("J") && userMbti.includes("S")) return "future"

  if (userMbti.includes("T") && idolMbti.includes("T")) return "cool"

  return "romantic"
}
