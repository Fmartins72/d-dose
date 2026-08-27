import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '../../components/StatCard'
import { listGraos } from '../../lib/graos'
import type { Grao } from '../../types/grao'
import { formatNumber } from '../../lib/format'

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function PilhaGraos() {
  const [graos, setGraos] = useState<Grao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [graoId, setGraoId] = useState('')
  const [comprimento, setComprimento] = useState('')
  const [largura, setLargura] = useState('')
  const [altura, setAltura] = useState('')

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
    const c = Number(comprimento)
    const l = Number(largura)
    const a = Number(altura)
    if (!grao || !c || c <= 0 || !l || l <= 0 || !a || a <= 0) return null

    const volumeM3 = c * l * a
    const toneladas = (volumeM3 * grao.densidade_aparente_kg_m3) / 1000
    const sacas = (toneladas * 1000) / grao.peso_saca_kg
    const fosfinaKg = (volumeM3 * grao.dosagem_fumigante_g_m3) / 1000

    return { toneladas, sacas, volumeM3, fosfinaKg }
  }, [grao, comprimento, largura, altura])

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
          <select id="grao" value={graoId} onChange={(e) => setGraoId(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle}>
            {graos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="comprimento">
              Comprimento (m)
            </label>
            <input id="comprimento" type="number" inputMode="decimal" min="0" step="0.01" value={comprimento} onChange={(e) => setComprimento(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="largura">
              Largura (m)
            </label>
            <input id="largura" type="number" inputMode="decimal" min="0" step="0.01" value={largura} onChange={(e) => setLargura(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="altura">
              Altura (m)
            </label>
            <input id="altura" type="number" inputMode="decimal" min="0" step="0.01" value={altura} onChange={(e) => setAltura(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
          </div>
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
