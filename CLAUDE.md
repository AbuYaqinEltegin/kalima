# Калима — карточки арабских слов

React 18 + Vite 6 + Tailwind v4 + react-router 6. План этапов: PLAN.md (этапы 1–4 готовы). PWA: vite-plugin-pwa в `vite.config.js`, иконки в `public/` (сгенерированы System.Drawing). Vercel: `vercel.json` (SPA-rewrite).

## Логика
- `src/lib/sm2.js` — чистый SM-2 (`review`, `isDue`, `dayKey`, `GRADES`: снова=1, трудно=3, хорошо=4, легко=5), тесты рядом.
- `src/lib/storage.js` — localStorage: `kalima:progress` {cardId: {ef,interval,reps,due}}, `kalima:log` {день: число повторений} — для статистики.
- Study: очередь = повторения, затем новые; «снова» → через 4 карточки. `/deck/all` — поток из всех колод (`allDeck`), после колоды — кнопка «Дальше».
- `src/lib/speak.js` — озвучка (Web Speech API, ar), авто при перевороте, клавиша S. `src/lib/plural.js` — склонения.
- Деплой: `git push` (GitHub AbuYaqinEltegin/kalima связан с Vercel yaqin3/kalima → kalima-seven.vercel.app). Git: `C:\Program Files\Git\cmd`.
- `src/lib/stats.js` — `streak`, `lastDays` (+тесты). Ответы в тесте пишут `logActivity()`, но SM-2 не трогают.
- Маршруты: `/`, `/deck/:id`, `/deck/:id/quiz`, `/stats` (lazy, Recharts; цвета графика — `var(--gold)` и т.п.).

## Правила работы
- Экономь токены: не перечитывай файлы без нужды, ответы короткие, по-русски.
- Node в PATH может не быть: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`.
- Проверка: `npm run build` (позже `npm test`).

## Дизайн
- Цвета только семантические (`bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `text-gold`, `bg-forest`, `text-forest-ink`), заданы CSS-переменными в `src/index.css`; тёмная тема — класс `.dark` на `<html>`, переменные переопределяются там же. Префикс `dark:` почти не нужен.
- Без чистого белого — пользователю светлая тема «слепила глаза».
- Шрифты: `font-display` (Cormorant Garamond) — заголовки, `.arabic` (Amiri, rtl), Inter — остальное.
- Утилиты: `.pattern` (орнамент), `.frame` (двойная рамка), `.flip-*` (3D-переворот), `shadow-soft`.

## Данные
- `src/data/decks.js`: 18 колод, 390 слов; `deck(id, prefix, …, [[ar,tr,ru,id?]])`, id = префикс+номер. `card.id` — ключ прогресса SM-2: новые слова только в конец или с явным id.
