import { dayKey, addDays } from './sm2.js'

// Серия: дни подряд с активностью. Если сегодня ещё не занимались, серия не прерывается
export function streak(log, today = dayKey()) {
  let d = log[today] ? today : addDays(today, -1)
  let n = 0
  while (log[d] > 0) {
    n++
    d = addDays(d, -1)
  }
  return n
}

export function lastDays(log, n = 30, today = dayKey()) {
  return Array.from({ length: n }, (_, k) => {
    const day = addDays(today, k - n + 1)
    return { day, count: log[day] ?? 0 }
  })
}
