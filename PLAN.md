# Арабские карточки — план

Стек: React 18 + Vite + Tailwind v4 + react-router. Шрифты: Amiri (арабский), Inter (UI).
Палитра: песочный `sand`, тёмно-зелёный `forest`, золотой `gold`. Тёмная тема через класс `.dark`.

## Этапы
1. **Основа** — главная (список колод), страница карточек с 3D-переворотом, тёмная тема.
2. **SM-2** — оценки снова/трудно/хорошо/легко, localStorage, тесты Vitest.
3. **Режимы** — тест с 4 вариантами, статистика (Recharts, 30 дней, серия дней).
4. **PWA + Vercel** — vite-plugin-pwa, офлайн, vercel.json.

## Структура
```
src/
  main.jsx, App.jsx, index.css
  data/decks.js          — встроенные колоды
  lib/sm2.js (+ .test.js) — алгоритм (этап 2)
  lib/storage.js         — localStorage (этап 2)
  hooks/useTheme.js
  components/  Layout, ThemeToggle, DeckCard, FlipCard
  pages/       Home, Study, Quiz (3), Stats (3)
```
