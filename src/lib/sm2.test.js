import { describe, it, expect } from 'vitest'
import { review, isDue, addDays, NEW_CARD } from './sm2.js'

const T = '2026-01-10'

describe('SM-2', () => {
  it('новая карточка с «хорошо» → 1 день, потом 6, потом interval*ef', () => {
    const a = review(NEW_CARD, 4, T)
    expect(a).toMatchObject({ interval: 1, reps: 1, ef: 2.5, due: '2026-01-11' })
    const b = review(a, 4, a.due)
    expect(b).toMatchObject({ interval: 6, reps: 2 })
    const c = review(b, 4, b.due)
    expect(c.interval).toBe(15) // round(6 * 2.5)
    expect(c.reps).toBe(3)
  })

  it('«снова» сбрасывает повторения и уменьшает ef', () => {
    const s = { ef: 2.5, interval: 15, reps: 3, due: T }
    const r = review(s, 1, T)
    expect(r).toMatchObject({ reps: 0, interval: 1, due: '2026-01-11' })
    expect(r.ef).toBeCloseTo(1.96)
  })

  it('«легко» увеличивает ef, «трудно» уменьшает', () => {
    expect(review(NEW_CARD, 5, T).ef).toBeCloseTo(2.6)
    expect(review(NEW_CARD, 3, T).ef).toBeCloseTo(2.36)
  })

  it('ef не опускается ниже 1.3', () => {
    let s = NEW_CARD
    for (let k = 0; k < 10; k++) s = review(s, 1, T)
    expect(s.ef).toBe(1.3)
  })

  it('isDue: новая и просроченная — да, будущая — нет', () => {
    expect(isDue(undefined, T)).toBe(true)
    expect(isDue({ due: '2026-01-09' }, T)).toBe(true)
    expect(isDue({ due: T }, T)).toBe(true)
    expect(isDue({ due: '2026-01-11' }, T)).toBe(false)
  })

  it('addDays переходит через месяц и год', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-12-30', 6)).toBe('2027-01-05')
  })
})
