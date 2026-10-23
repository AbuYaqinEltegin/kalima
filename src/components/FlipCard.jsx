import { speak } from '../lib/speak.js'

const face = 'flip-face frame flex flex-col items-center justify-center rounded-[1.75rem] p-8 shadow-soft'

export default function FlipCard({ card, flipped, onFlip }) {
  return (
    <div className="relative">
      <button
        onClick={onFlip}
        className="flip-scene block h-[22rem] w-full cursor-pointer text-center sm:h-96"
        aria-label={flipped ? 'Показать слово' : 'Показать перевод'}
      >
        <div className={`flip-inner h-full w-full ${flipped ? 'flipped' : ''}`}>
          <div className={`${face} bg-surface`}>
            <span className="arabic text-6xl sm:text-7xl">{card.ar}</span>
            <span className="absolute bottom-8 text-xs uppercase tracking-[0.25em] text-muted">
              нажмите или пробел
            </span>
          </div>

          <div className={`${face} flip-back overflow-hidden bg-forest text-forest-ink`}>
            <div className="pattern absolute inset-0 opacity-15" />
            <span className="arabic relative text-3xl text-gold">{card.ar}</span>
            <span className="relative mt-1 font-display text-xl italic opacity-70">{card.tr}</span>
            <span className="relative my-5 h-px w-16 bg-gold/50" />
            <span className="relative font-display text-5xl font-semibold">{card.ru}</span>
          </div>
        </div>
      </button>

      {/* отдельно от карточки: кнопка в кнопке недопустима */}
      <button
        onClick={() => speak(card.ar)}
        aria-label="Произнести"
        title="Произнести (S)"
        className={`absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105 ${
          flipped ? 'border-gold/40 text-gold' : 'border-line text-muted hover:text-gold'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      </button>
    </div>
  )
}
