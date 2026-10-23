import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { decks, getDeck } from '../data/decks.js'
import { GRADES, review, isDue } from '../lib/sm2.js'
import { getProgress, gradeCard } from '../lib/storage.js'
import { plural } from '../lib/plural.js'
import { speak } from '../lib/speak.js'
import FlipCard from '../components/FlipCard.jsx'

const gradeStyle = {
  again: 'border-red-800/30 text-red-800 dark:border-red-300/30 dark:text-red-300',
  hard: 'border-line text-muted',
  good: 'border-line',
  easy: 'border-gold/60 text-gold',
}

// «снова» — карточка вернётся через несколько других, а не в конец длинной очереди
const AGAIN_GAP = 4

// сначала повторения (уже начатые карточки), затем новые — по порядку колоды
const buildQueue = (deck, progress) => {
  const due = deck.cards.filter((c) => isDue(progress[c.id]))
  return [...due.filter((c) => progress[c.id]), ...due.filter((c) => !progress[c.id])]
}

export default function Study() {
  const { id } = useParams()
  // key сбрасывает состояние при переходе к следующей колоде
  return <Session key={id} deck={getDeck(id)} />
}

function Session({ deck }) {
  const [progress, setProgress] = useState(getProgress)
  const [queue, setQueue] = useState(() => (deck ? buildQueue(deck, progress) : []))
  const [done, setDone] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = queue[0]

  const flip = () => {
    if (!flipped) speak(card.ar)
    setFlipped((f) => !f)
  }

  const grade = (g) => {
    const state = gradeCard(card.id, g.q)
    setProgress((p) => ({ ...p, [card.id]: state }))
    setFlipped(false)
    // ждём поворота лицом, чтобы не мелькнул перевод следующей карточки
    setTimeout(() => {
      setQueue(([first, ...rest]) =>
        g.key === 'again' ? [...rest.slice(0, AGAIN_GAP), first, ...rest.slice(AGAIN_GAP)] : rest,
      )
      if (g.key !== 'again') setDone((n) => n + 1)
    }, 350)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (!card) return
      if (e.code === 'Space') { e.preventDefault(); flip() }
      if (e.code === 'KeyS') speak(card.ar)
      const g = GRADES[Number(e.key) - 1]
      if (flipped && g) grade(g)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!deck) return <p>Колода не найдена. <Link to="/" className="underline">На главную</Link></p>

  const total = done + queue.length
  const isAll = deck.id === 'all'
  // следующая колода, где есть что учить
  const next = !isAll && decks.slice(decks.indexOf(deck) + 1).find((d) => d.cards.some((c) => isDue(progress[c.id])))

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Link to="/" className="text-sm text-muted transition hover:text-gold">← Все колоды</Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">{deck.title}</h1>
        </div>
        <div className="text-right">
          <Link to={`/deck/${deck.id}/quiz`} className="text-sm text-gold hover:underline">Режим теста →</Link>
          {total > 0 && (
            <p className="font-display text-2xl text-muted">
              <span className="text-ink">{done}</span> / {total}
            </p>
          )}
        </div>
      </div>

      {!card ? (
        <div className="frame rounded-[1.75rem] bg-surface px-8 py-16 text-center shadow-soft">
          <p className="arabic text-5xl text-gold">أَحْسَنْتَ</p>
          <h2 className="mt-4 font-display text-3xl font-semibold">{isAll ? 'На сегодня всё' : 'Колода пройдена'}</h2>
          <p className="mt-2 text-muted">
            {done
              ? `Повторено карточек: ${done}.`
              : 'Все карточки запланированы на другие дни — интервальное повторение напомнит о них вовремя.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {next && (
              <Link to={`/deck/${next.id}`} className="rounded-full bg-forest px-7 py-3 font-medium text-forest-ink shadow-soft">
                Дальше: {next.title} →
              </Link>
            )}
            {!isAll && (
              <Link to="/deck/all" className="rounded-full border border-line bg-surface px-7 py-3 font-medium shadow-soft">
                Все слова подряд
              </Link>
            )}
            <Link to="/" className="rounded-full border border-line bg-surface px-7 py-3 font-medium shadow-soft">
              К колодам
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
          </div>

          <FlipCard card={card} flipped={flipped} onFlip={flip} />

          <div className={`mt-8 grid grid-cols-4 gap-2 transition-opacity ${flipped ? '' : 'pointer-events-none opacity-0'}`}>
            {GRADES.map((g, k) => {
              const days = review(progress[card.id], g.q).interval
              return (
                <button
                  key={g.key}
                  onClick={() => grade(g)}
                  tabIndex={flipped ? 0 : -1}
                  className={`rounded-2xl border bg-surface py-3 shadow-soft transition hover:-translate-y-0.5 ${gradeStyle[g.key]}`}
                >
                  <span className="block font-medium">{g.label}</span>
                  <span className="block text-xs opacity-70">
                    {g.key === 'again' ? 'сейчас' : `${days} ${plural(days, ['день', 'дня', 'дней'])}`} · {k + 1}
                  </span>
                </button>
              )
            })}
          </div>
          {!flipped && <p className="-mt-12 text-center text-sm text-muted">Вспомните перевод и переверните карточку</p>}
        </>
      )}
    </div>
  )
}
