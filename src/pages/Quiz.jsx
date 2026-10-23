import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { decks, getDeck } from '../data/decks.js'
import { logActivity } from '../lib/storage.js'

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

// Неверные варианты сначала из той же колоды, при нехватке — из остальных
function buildQuestions(deck) {
  const others = decks.flatMap((d) => (d.id === deck.id ? [] : d.cards))
  return shuffle(deck.cards).map((card) => {
    const wrong = [...shuffle(deck.cards), ...shuffle(others)]
      .filter((c, k, arr) => c.ru !== card.ru && arr.findIndex((x) => x.ru === c.ru) === k)
      .slice(0, 3)
    return { card, options: shuffle([card, ...wrong]) }
  })
}

export default function Quiz() {
  const { id } = useParams()
  const deck = getDeck(id)
  const [questions, setQuestions] = useState(() => (deck ? buildQuestions(deck) : []))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const q = questions[i]

  const pick = (opt) => {
    if (picked) return
    setPicked(opt)
    logActivity()
    if (opt.id === q.card.id) setScore((s) => s + 1)
  }
  const next = () => {
    setPicked(null)
    setI((n) => n + 1)
  }
  const restart = () => {
    setQuestions(buildQuestions(deck))
    setI(0)
    setScore(0)
    setPicked(null)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (!q) return
      const opt = q.options[Number(e.key) - 1]
      if (opt) pick(opt)
      if (picked && (e.key === 'Enter' || e.code === 'Space')) { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!deck) return <p>Колода не найдена. <Link to="/" className="underline">На главную</Link></p>

  const optionStyle = (opt) => {
    if (!picked) return 'border-line bg-surface hover:-translate-y-0.5 hover:border-gold'
    if (opt.id === q.card.id) return 'border-emerald-700 bg-emerald-700/15 dark:border-emerald-400'
    if (opt.id === picked.id) return 'border-red-700 bg-red-700/10 dark:border-red-400'
    return 'border-line bg-surface opacity-50'
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Link to={`/deck/${id}`} className="text-sm text-muted transition hover:text-gold">← Карточки</Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">Тест · {deck.title}</h1>
        </div>
        {q && (
          <span className="font-display text-2xl text-muted">
            <span className="text-ink">{i + 1}</span> / {questions.length}
          </span>
        )}
      </div>

      {!q ? (
        <div className="frame rounded-[1.75rem] bg-surface px-8 py-16 text-center shadow-soft">
          <p className="font-display text-7xl font-semibold text-gold">
            {score}<span className="text-3xl text-muted"> / {questions.length}</span>
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold">
            {score === questions.length ? 'Безупречно!' : score >= questions.length * 0.7 ? 'Хороший результат' : 'Есть над чем поработать'}
          </h2>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={restart} className="rounded-full border border-line px-7 py-3 font-medium hover:bg-surface-2">
              Ещё раз
            </button>
            <Link to="/" className="rounded-full bg-forest px-7 py-3 font-medium text-forest-ink shadow-soft">
              К колодам
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="frame mb-6 flex h-52 flex-col items-center justify-center rounded-[1.75rem] bg-surface shadow-soft">
            <span className="arabic text-6xl">{q.card.ar}</span>
            {picked && <span className="mt-1 font-display text-lg italic text-muted">{q.card.tr}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, k) => (
              <button
                key={opt.id}
                onClick={() => pick(opt)}
                className={`rounded-2xl border px-4 py-4 text-left shadow-soft transition ${optionStyle(opt)}`}
              >
                <span className="mr-2 text-xs text-muted">{k + 1}</span>
                <span className="font-medium">{opt.ru}</span>
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className={`mt-6 w-full rounded-full bg-forest py-3 font-medium text-forest-ink shadow-soft transition dark:bg-gold dark:text-bg ${picked ? '' : 'invisible'}`}
          >
            {i === questions.length - 1 ? 'Результат' : 'Дальше'} →
          </button>
        </>
      )}
    </div>
  )
}
