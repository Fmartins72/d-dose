import { Link, Outlet } from 'react-router-dom'

import { BottomNav } from '../components/BottomNav'
import { LegalDisclaimerGate } from '../components/LegalDisclaimerGate'
import { ThemeToggle } from '../components/ThemeToggle'

export function AppLayout() {
  return (
    <LegalDisclaimerGate>
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

        <div className="pb-1 text-center">
          <Link to="/aviso-legal" className="text-xs opacity-50 hover:opacity-80">
            Aviso legal
          </Link>
        </div>

        <BottomNav />
      </div>
    </LegalDisclaimerGate>
  )
}
