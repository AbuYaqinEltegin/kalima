import { Link } from 'react-router-dom'
import { decks, allDeck } from '../data/decks.js'
import DeckCard from '../components/DeckCard.jsx'
import { isDue } from '../lib/sm2.js'
import { getProgress } from '../lib/storage.js'
import { plural, words } from '../lib/plural.js'

export default function Home() {
  const progress = getProgress()
  const reviews = allDeck.cards.filter((c) => progress[c.id] && isDue(progress[c.id])).length
  const fresh = allDeck.cards.filter((c) => !progress[c.id]).length
  return (
    <>
      <section className="relative mb-12 overflow-hidden rounded-[2rem] bg-forest px-7 py-10 text-forest-ink shadow-soft sm:px-12 sm:py-14 dark:border dark:border-line">
        <div className="pattern absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-transparent" />
        <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Арабский язык</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
              Слово за словом —<br />к живой речи
            </h1>
            <p className="mt-4 max-w-md opacity-75">
              {decks.length} {plural(decks.length, ['колода', 'колоды', 'колод'])} и {words(allDeck.cards.length)} с
              огласовками, транслитерацией и озвучкой.
            </p>
            <Link
              to="/deck/all"
              className="mt-6 inline-block rounded-full bg-gold px-7 py-3 font-medium text-forest shadow-soft transition hover:-translate-y-0.5"
            >
              Учить все слова подряд
            </Link>
            <p className="mt-3 text-sm opacity-60">
              {reviews > 0 && `к повторению: ${reviews} · `}новых: {fresh}
            </p>
          </div>
          <p className="arabic text-6xl text-gold sm:text-7xl">أَهْلًا</p>
        </div>
      </section>

      <div className="mb-5 flex items-center gap-4">
        <h2 className="font-display text-2xl font-semibold">Колоды</h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {decks.map((d, i) => (
          <DeckCard key={d.id} deck={d} index={i} due={d.cards.filter((c) => progress[c.id] && isDue(progress[c.id])).length} />
        ))}
      </div>
    </>
  )
}
