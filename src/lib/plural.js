// plural(5, ['слово', 'слова', 'слов']) → 'слов'
export function plural(n, [one, few, many]) {
  const a = n % 10, b = n % 100
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many
}

export const words = (n) => `${n} ${plural(n, ['слово', 'слова', 'слов'])}`
