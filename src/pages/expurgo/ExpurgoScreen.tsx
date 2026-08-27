import { useState } from 'react'

import { ExpurgoCalc } from './ExpurgoCalc'
import { PilhaGraos } from './PilhaGraos'
import { VolumeSilo } from './VolumeSilo'

type Tab = 'expurgo' | 'volume' | 'pilha'

const tabs: { value: Tab; label: string }[] = [
  { value: 'expurgo', label: 'Expurgo' },
  { value: 'volume', label: 'Volume m³' },
  { value: 'pilha', label: 'Pilha m³' },
]

export function ExpurgoScreen() {
  const [tab, setTab] = useState<Tab>('expurgo')

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-grao)' }}>
        Expurgo
      </h1>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium"
            style={
              tab === t.value
                ? { background: 'var(--color-grao)', color: 'var(--color-on-accent)' }
                : { background: 'var(--color-surface)', color: 'var(--color-text)', opacity: 0.7, border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'expurgo' && <ExpurgoCalc />}
      {tab === 'volume' && <VolumeSilo />}
      {tab === 'pilha' && <PilhaGraos />}
    </div>
  )
}
