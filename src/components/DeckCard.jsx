import { Link } from 'react-router-dom'
import { words } from '../lib/plural.js'

export default function DeckCard({ deck, index, due }) {
  return (
    <Link
      to={`/deck/${deck.id}`}
      className="frame group relative flex min-h-52 flex-col overflow-hidden rounded-3xl bg-surface p-7 shadow-soft transition duration-300 hover:-translate-y-1"
    >
      {/* крупная буква-водяной знак */}
      <span className="arabic pointer-events-none absolute -bottom-10 -left-2 text-[9rem] leading-none text-gold opacity-15 transition duration-500 group-hover:opacity-25">
        {deck.icon}
      </span>

      <div className="relative flex items-start justify-between">
        <span className="font-display text-sm italic text-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-right text-xs uppercase tracking-[0.2em] text-muted">
          {words(deck.cards.length)}
          {due > 0 && <span className="mt-1 block text-gold">к повторению: {due}</span>}
        </span>
      </div>

      <h2 className="relative mt-4 font-display text-3xl font-semibold leading-tight">{deck.title}</h2>
      <p className="relative mt-1 text-sm text-muted">{deck.description}</p>

      <p className="arabic relative mt-auto pt-6 text-right text-xl text-gold">
        {deck.cards.slice(0, 3).map((c) => c.ar).join(' · ')}
      </p>
    </Link>
  )
}
