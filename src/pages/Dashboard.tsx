import { FlaskConical, List, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'

const atalhos = [
  { to: '/expurgo', label: 'Expurgo', description: 'Fosfina para expurgo, silo ou pilha', icon: Wind, accent: 'var(--color-grao)' },
  { to: '/diluicoes', label: 'Diluições', description: 'Dose de produtos por praga', icon: FlaskConical, accent: 'var(--color-diluicao)' },
  { to: '/lista', label: 'Lista', description: 'Consultar grãos e produtos cadastrados', icon: List, accent: 'var(--color-neutro)' },
]

export function Dashboard() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-xl font-bold">D-Dose</h1>
      <p className="mb-4 text-sm opacity-60">Calculadora de dose de fosfina e diluição de produtos.</p>

      <div className="flex flex-col gap-3">
        {atalhos.map(({ to, label, description, icon: Icon, accent }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ background: accent, color: 'var(--color-on-accent)' }}>
              <Icon size={22} />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-xs opacity-60">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
