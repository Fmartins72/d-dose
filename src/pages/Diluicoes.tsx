import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GiAnt, GiFly, GiLongLeggedSpider, GiWheat } from 'react-icons/gi'
import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '../components/StatCard'
import { UnitToggle } from '../components/UnitToggle'
import { listProdutoPragasComNomeByPraga, type ProdutoPragaComNome } from '../lib/diluicoes'
import { formatNumber } from '../lib/format'
import { listPragas } from '../lib/pragas'
import { CLASSES_PRAGA, type ClassePraga, type Praga } from '../types/praga'

type UnidadeEntrada = 'area' | 'produto'

const classeIcons: Record<ClassePraga, typeof GiAnt> = {
  'Insetos Rasteiros': GiAnt,
  'Insetos Voadores': GiFly,
  'Demais Pragas': GiLongLeggedSpider,
  'Grãos Armazenados': GiWheat,
}

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function Diluicoes() {
  const [pragas, setPragas] = useState<Praga[]>([])
  const [loadingPragas, setLoadingPragas] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [classe, setClasse] = useState<ClassePraga | null>(null)
  const [pragaId, setPragaId] = useState<string | null>(null)

  const [relacoes, setRelacoes] = useState<ProdutoPragaComNome[]>([])
  const [loadingRelacoes, setLoadingRelacoes] = useState(false)
  const [relacaoId, setRelacaoId] = useState<string | null>(null)

  const [unidadeEntrada, setUnidadeEntrada] = useState<UnidadeEntrada>('area')
  const [valorEntrada, setValorEntrada] = useState('')

  useEffect(() => {
    listPragas()
      .then(setPragas)
      .catch(() => setError('Não foi possível carregar as pragas cadastradas.'))
      .finally(() => setLoadingPragas(false))
  }, [])

  useEffect(() => {
    if (!pragaId) {
      setRelacoes([])
      return
    }
    setLoadingRelacoes(true)
    listProdutoPragasComNomeByPraga(pragaId)
      .then(setRelacoes)
      .catch(() => setError('Não foi possível carregar os produtos para essa praga.'))
      .finally(() => setLoadingRelacoes(false))
  }, [pragaId])

  const relacao = relacoes.find((r) => r.id === relacaoId) ?? null

  const resultado = useMemo(() => {
    const valor = Number(valorEntrada)
    if (!relacao || !valor || valor <= 0) return null

    const fator = unidadeEntrada === 'area' ? valor / relacao.area_m2 : valor / relacao.dose_produto

    return {
      produto: fator * relacao.dose_produto,
      diluenteL: fator * relacao.volume_diluente_l,
      areaM2: fator * relacao.area_m2,
    }
  }, [relacao, unidadeEntrada, valorEntrada])

  const pragasDaClasse = classe ? pragas.filter((p) => p.classe === classe) : []

  const voltarParaClasses = () => {
    setClasse(null)
    setPragaId(null)
    setRelacaoId(null)
    setValorEntrada('')
  }

  const voltarParaPragas = () => {
    setPragaId(null)
    setRelacaoId(null)
    setValorEntrada('')
  }

  const voltarParaProdutos = () => {
    setRelacaoId(null)
    setValorEntrada('')
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-diluicao)' }}>
        Diluições
      </h1>

      {error && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-alerta)' }}>
          {error}
        </p>
      )}

      {/* Passo 1: classe */}
      {!classe && (
        <>
          <p className="mb-3 text-sm font-medium">Selecione a classe do inseto</p>
          {loadingPragas ? (
            <p className="text-sm opacity-60">Carregando…</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {CLASSES_PRAGA.map((c) => {
                const Icon = classeIcons[c]
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClasse(c)}
                    className="flex flex-col items-center gap-2 rounded-lg p-4 text-center text-sm font-medium"
                    style={{ background: 'var(--color-diluicao)', color: '#fff' }}
                  >
                    <Icon size={28} />
                    {c}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Passo 2: praga */}
      {classe && !pragaId && (
        <>
          <button type="button" onClick={voltarParaClasses} className="mb-3 flex items-center gap-1 text-sm" style={{ color: 'var(--color-diluicao)' }}>
            <ChevronLeft size={16} /> {classe}
          </button>
          {pragasDaClasse.length === 0 ? (
            <p className="text-sm opacity-60">Nenhuma praga cadastrada nessa classe ainda.</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
              {pragasDaClasse.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPragaId(p.id)}
                    className="flex w-full items-center justify-between py-3 text-left font-medium active:opacity-60"
                  >
                    {p.nome}
                    <ChevronRight size={18} className="opacity-40" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Passo 3: produto */}
      {pragaId && !relacaoId && (
        <>
          <button type="button" onClick={voltarParaPragas} className="mb-3 flex items-center gap-1 text-sm" style={{ color: 'var(--color-diluicao)' }}>
            <ChevronLeft size={16} /> {pragas.find((p) => p.id === pragaId)?.nome}
          </button>
          {loadingRelacoes ? (
            <p className="text-sm opacity-60">Carregando…</p>
          ) : relacoes.length === 0 ? (
            <p className="text-sm opacity-60">Nenhum produto cadastrado para essa praga ainda.</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
              {relacoes.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => setRelacaoId(r.id)} className="flex w-full items-center justify-between py-3 text-left active:opacity-60">
                    <div>
                      <p className="font-medium">
                        {r.produto_nome}
                        {r.metodo_aplicacao && <span className="opacity-60"> · {r.metodo_aplicacao}</span>}
                      </p>
                      <p className="text-xs opacity-60">
                        {r.dose_produto} {r.unidade_dose} / {r.volume_diluente_l} L de {r.tipo_diluente} / {r.area_m2} m²
                      </p>
                    </div>
                    <ChevronRight size={18} className="opacity-40" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Passo 4: cálculo */}
      {relacao && (
        <>
          <button type="button" onClick={voltarParaProdutos} className="mb-3 flex items-center gap-1 text-sm" style={{ color: 'var(--color-diluicao)' }}>
            <ChevronLeft size={16} /> {relacao.produto_nome}
          </button>

          <div
            className="mb-4 flex flex-col gap-3 rounded-lg p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
          >
            <UnitToggle
              accent="var(--color-diluicao)"
              value={unidadeEntrada}
              onChange={setUnidadeEntrada}
              options={[
                { value: 'area', label: 'Área (m²)' },
                { value: 'produto', label: `Produto (${relacao.unidade_dose})` },
              ]}
            />

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="valorEntrada">
                {unidadeEntrada === 'area' ? 'Área a tratar (m²)' : `Quantidade de produto (${relacao.unidade_dose})`}
              </label>
              <input
                id="valorEntrada"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={valorEntrada}
                onChange={(e) => setValorEntrada(e.target.value)}
                className="w-full rounded border px-3 py-2"
                style={inputStyle}
              />
            </div>
          </div>

          {resultado && (
            <div className="grid grid-cols-1 gap-3">
              <StatCard label="Produto necessário" value={formatNumber(resultado.produto)} unit={relacao.unidade_dose} accent="var(--color-diluicao)" highlight />
              <StatCard label={relacao.tipo_diluente} value={formatNumber(resultado.diluenteL)} unit="L" accent="var(--color-diluicao)" />
              <StatCard label="Área coberta" value={formatNumber(resultado.areaM2)} unit="m²" accent="var(--color-diluicao)" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
