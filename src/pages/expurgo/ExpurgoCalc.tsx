import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '../../components/StatCard'
import { UnitToggle } from '../../components/UnitToggle'
import { listGraos } from '../../lib/graos'
import type { Grao } from '../../types/grao'
import { formatNumber } from '../../lib/format'

type Unidade = 'sacas' | 'toneladas'

const selectStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function ExpurgoCalc() {
  const [graos, setGraos] = useState<Grao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [graoId, setGraoId] = useState('')
  const [unidade, setUnidade] = useState<Unidade>('sacas')
  const [quantidade, setQuantidade] = useState('')

  useEffect(() => {
    listGraos()
      .then((data) => {
        setGraos(data)
        if (data.length > 0) setGraoId(data[0].id)
      })
      .catch(() => setError('Não foi possível carregar os grãos cadastrados.'))
      .finally(() => setLoading(false))
  }, [])

  const grao = graos.find((g) => g.id === graoId)

  const resultado = useMemo(() => {
    const qtd = Number(quantidade)
    if (!grao || !qtd || qtd <= 0) return null

    const toneladas = unidade === 'toneladas' ? qtd : (qtd * grao.peso_saca_kg) / 1000
    const sacas = unidade === 'sacas' ? qtd : (toneladas * 1000) / grao.peso_saca_kg
    const volumeM3 = (toneladas * 1000) / grao.densidade_aparente_kg_m3
    const fosfinaKg = (volumeM3 * grao.dosagem_fumigante_g_m3) / 1000

    return { toneladas, sacas, volumeM3, fosfinaKg }
  }, [grao, unidade, quantidade])

  if (error) {
    return (
      <p className="text-sm" style={{ color: 'var(--color-alerta)' }}>
        {error}
      </p>
    )
  }

  if (loading) return <p className="text-sm opacity-60">Carregando…</p>

  if (graos.length === 0) {
    return <p className="text-sm opacity-60">Nenhum grão cadastrado ainda. Cadastre em Admin.</p>
  }

  return (
    <div>
      <div
        className="mb-4 flex flex-col gap-3 rounded-lg p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="grao">
            Cultura
          </label>
          <select id="grao" value={graoId} onChange={(e) => setGraoId(e.target.value)} className="w-full rounded border px-3 py-2" style={selectStyle}>
            {graos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>

        <UnitToggle
          accent="var(--color-grao)"
          value={unidade}
          onChange={setUnidade}
          options={[
            { value: 'sacas', label: 'Sacas' },
            { value: 'toneladas', label: 'Toneladas' },
          ]}
        />

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="quantidade">
            Quantidade ({unidade})
          </label>
          <input
            id="quantidade"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full rounded border px-3 py-2"
            style={selectStyle}
          />
        </div>
      </div>

      {resultado && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Toneladas" value={formatNumber(resultado.toneladas)} unit="ton" accent="var(--color-grao)" />
          <StatCard label="Sacas" value={formatNumber(resultado.sacas)} unit="sc" accent="var(--color-grao)" />
          <StatCard label="Volume" value={formatNumber(resultado.volumeM3)} unit="m³" accent="var(--color-grao)" />
          <StatCard label="Fosfina" value={formatNumber(resultado.fosfinaKg, 3)} unit="kg" accent="var(--color-grao)" highlight />
        </div>
      )}
    </div>
  )
}
