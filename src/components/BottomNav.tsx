import { FlaskConical, LayoutGrid, List, Wind } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true, accent: 'var(--color-text)' },
  { to: '/expurgo', label: 'Expurgo', icon: Wind, end: false, accent: 'var(--color-grao)' },
  { to: '/diluicoes', label: 'Diluições', icon: FlaskConical, end: false, accent: 'var(--color-diluicao)' },
  { to: '/lista', label: 'Lista', icon: List, end: false, accent: 'var(--color-text)' },
]

export function BottomNav() {
  return (
    <nav
      className="sticky bottom-0 flex border-t"
      style={{ background: 'var(--color-surface)', borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}
    >
      {navItems.map(({ to, label, icon: Icon, end, accent }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive ? '' : 'opacity-60'
            }`
          }
          style={({ isActive }) => ({
            color: isActive ? accent : 'var(--color-text)',
          })}
        >
          <Icon size={22} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
