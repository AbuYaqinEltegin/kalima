import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { decks } from '../data/decks.js'
import { getLog, getProgress } from '../lib/storage.js'
import { streak, lastDays } from '../lib/stats.js'
import { dayKey } from '../lib/sm2.js'

const fmt = (day) => day.slice(8) + '.' + day.slice(5, 7)

function Tile({ label, value, hint }) {
  return (
    <div className="frame rounded-3xl bg-surface p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  )
}

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { day, count } = payload[0].payload
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-soft">
      <span className="text-muted">{fmt(day)}</span> · <b>{count}</b>
    </div>
  )
}

export default function Stats() {
  const log = getLog()
  const progress = getProgress()
  const days = lastDays(log, 30)
  const s = streak(log)
  const month = days.reduce((n, d) => n + d.count, 0)
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0)
  const learned = Object.values(progress).filter((p) => p.reps > 0).length

  return (
    <>
      <h1 className="mb-8 font-display text-4xl font-semibold">Статистика</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Tile label="Дней подряд" value={s} hint={s ? 'Не прерывайте серию' : 'Начните сегодня'} />
        <Tile label="Сегодня" value={log[dayKey()] ?? 0} hint="повторений" />
        <Tile label="Выучено" value={`${learned}/${totalCards}`} hint="слов" />
      </div>

      <div className="frame rounded-3xl bg-surface p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold">Повторения за 30 дней</h2>
          <span className="text-sm text-muted">всего {month}</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ left: -24, right: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={fmt}
                interval={6}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
                tickLine={false}
              />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--surface-2)' }} />
              <Bar dataKey="count" fill="var(--gold)" radius={[6, 6, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
