import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '../../components/StatCard'
import { calcularVolumeSilo } from '../../lib/calculosGraos'
import { listGraos } from '../../lib/graos'
import type { Grao } from '../../types/grao'
import { formatNumber } from '../../lib/format'

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function VolumeSilo() {
  const [graos, setGraos] = useState<Grao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [graoId, setGraoId] = useState('')
  const [diametro, setDiametro] = useState('')
  const [alturaGraos, setAlturaGraos] = useState('')
  const [alturaCone, setAlturaCone] = useState('')

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
    const diametroVal = Number(diametro)
    const alturaGraosVal = Number(alturaGraos)
    const alturaConeVal = Number(alturaCone) || 0
    if (!grao || !diametroVal || diametroVal <= 0 || !alturaGraosVal || alturaGraosVal <= 0) return null

    return calcularVolumeSilo(diametroVal, alturaGraosVal, alturaConeVal, {
      densidadeAparenteKgM3: grao.densidade_aparente_kg_m3,
      pesoSacaKg: grao.peso_saca_kg,
      dosagemFumiganteGM3: grao.dosagem_fumigante_g_m3,
    })
  }, [grao, diametro, alturaGraos, alturaCone])

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
            <label className="mb-1 block text-sm font-medium" htmlFor="diametro">
              Diâmetro (m)
            </label>
            <input id="diametro" type="number" inputMode="decimal" min="0" step="0.01" value={diametro} onChange={(e) => setDiametro(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="alturaGraos">
              Altura grãos (m)
            </label>
            <input id="alturaGraos" type="number" inputMode="decimal" min="0" step="0.01" value={alturaGraos} onChange={(e) => setAlturaGraos(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="alturaCone">
              Altura cone (m)
            </label>
            <input id="alturaCone" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={alturaCone} onChange={(e) => setAlturaCone(e.target.value)} className="w-full rounded border px-3 py-2" style={inputStyle} />
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
