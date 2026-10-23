import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Study from './pages/Study.jsx'
import Quiz from './pages/Quiz.jsx'
import { lazy, Suspense } from 'react'

// Recharts тяжёлый — грузим статистику отдельным чанком
const Stats = lazy(() => import('./pages/Stats.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="deck/:id" element={<Study />} />
        <Route path="deck/:id/quiz" element={<Quiz />} />
        <Route path="stats" element={<Suspense fallback={null}><Stats /></Suspense>} />
      </Route>
    </Routes>
  )
}
