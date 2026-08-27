import { Outlet } from 'react-router-dom'

import { BottomNav } from '../components/BottomNav'
import { ThemeToggle } from '../components/ThemeToggle'

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <span className="text-lg font-bold" style={{ color: 'var(--color-grao)' }}>
          D-Dose
        </span>
        <ThemeToggle />
      </header>

      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
