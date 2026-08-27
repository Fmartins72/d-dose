import { LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

const adminNavItems = [
  { to: '/admin', label: 'Grãos', end: true },
  { to: '/admin/pragas', label: 'Pragas', end: false },
  { to: '/admin/produtos', label: 'Produtos', end: false },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <span className="text-lg font-bold" style={{ color: 'var(--color-grao)' }}>
          D-Dose · Admin
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button type="button" onClick={handleSignOut} aria-label="Sair" style={{ color: 'var(--color-text)' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <nav
        className="flex gap-4 px-4 py-2 text-sm font-medium"
        style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        {adminNavItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'opacity-100' : 'opacity-60')}
            style={{ color: 'var(--color-grao)' }}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
