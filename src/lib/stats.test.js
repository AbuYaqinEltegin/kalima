import { describe, it, expect } from 'vitest'
import { streak, lastDays } from './stats.js'

const T = '2026-03-01'

describe('статистика', () => {
  it('серия считает дни подряд, включая переход через месяц', () => {
    expect(streak({ '2026-03-01': 3, '2026-02-28': 1, '2026-02-27': 2, '2026-02-25': 5 }, T)).toBe(3)
  })

  it('без занятий сегодня серия идёт со вчера', () => {
    expect(streak({ '2026-02-28': 1, '2026-02-27': 1 }, T)).toBe(2)
  })

  it('пропуск вчера обнуляет серию', () => {
    expect(streak({ '2026-02-27': 4 }, T)).toBe(0)
  })

  it('lastDays возвращает n дней, последний — сегодня', () => {
    const days = lastDays({ [T]: 7 }, 30, T)
    expect(days).toHaveLength(30)
    expect(days[29]).toEqual({ day: T, count: 7 })
    expect(days[0].day).toBe('2026-01-31')
  })
})
