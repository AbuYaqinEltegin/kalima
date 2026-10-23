import { review, dayKey } from './sm2.js'

const PROGRESS = 'kalima:progress' // { [cardId]: { ef, interval, reps, due } }
const LOG = 'kalima:log' // { 'YYYY-MM-DD': число повторений } — для статистики

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? {}
  } catch {
    return {}
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const getProgress = () => load(PROGRESS)
export const getLog = () => load(LOG)

export function gradeCard(cardId, q) {
  const today = dayKey()
  const progress = load(PROGRESS)
  progress[cardId] = review(progress[cardId], q, today)
  save(PROGRESS, progress)
  logActivity()
  return progress[cardId]
}

// Каждый ответ (карточка или тест) считается повторением за сегодня
export function logActivity() {
  const today = dayKey()
  const log = load(LOG)
  log[today] = (log[today] ?? 0) + 1
  save(LOG, log)
}
