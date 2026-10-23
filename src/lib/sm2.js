// SM-2 (SuperMemo 2). Кнопки оценки → качество ответа q (0..5)
export const GRADES = [
  { key: 'again', label: 'Снова', q: 1 },
  { key: 'hard', label: 'Трудно', q: 3 },
  { key: 'good', label: 'Хорошо', q: 4 },
  { key: 'easy', label: 'Легко', q: 5 },
]

export const NEW_CARD = { ef: 2.5, interval: 0, reps: 0, due: null }

// Дата в формате YYYY-MM-DD по местному времени
export function dayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + n))
}

export function review(state = NEW_CARD, q, today = dayKey()) {
  let { ef, interval, reps } = state

  if (q < 3) {
    reps = 0
    interval = 1
  } else {
    interval = reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * ef)
    reps += 1
  }

  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  ef = Math.round(ef * 100) / 100

  return { ef, interval, reps, due: addDays(today, interval) }
}

export const isDue = (state, today = dayKey()) => !state?.due || state.due <= today
