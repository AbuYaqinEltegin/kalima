import { Link, NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

const navCls = ({ isActive }) =>
  `rounded-full px-3 py-2 transition ${isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink'}`

export default function Layout() {
  return (
    <div className="page-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 sm:px-8">
        <header className="flex items-center justify-between border-b border-line py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="arabic text-3xl font-bold leading-none text-gold">كلمة</span>
            <span className="hidden h-6 w-px bg-line sm:block" />
            <span className="hidden font-display text-2xl font-semibold tracking-wide sm:block">Калима</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-3">
            <NavLink to="/" end className={navCls}>Колоды</NavLink>
            <NavLink to="/stats" className={navCls}>Статистика</NavLink>
            <ThemeToggle />
          </nav>
        </header>
        <main className="flex-1 py-8 sm:py-10">
          <Outlet />
        </main>
        <footer className="border-t border-line py-5 text-center font-display text-sm italic text-muted">
          «Знание — сокровищница, а ключ к ней — вопрос»
        </footer>
      </div>
    </div>
  )
}
