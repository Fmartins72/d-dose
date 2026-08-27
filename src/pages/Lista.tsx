import { useEffect, useState } from 'react'

import { listAllProdutoPragasComNomes, type ProdutoPragaComNomes } from '../lib/diluicoes'
import { listGraos } from '../lib/graos'
import { listProdutos } from '../lib/produtos'
import type { Grao } from '../types/grao'
import type { Produto } from '../types/produto'

type Tab = 'graos' | 'produtos'

export function Lista() {
  const [tab, setTab] = useState<Tab>('graos')
  const [graos, setGraos] = useState<Grao[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [diluicoes, setDiluicoes] = useState<ProdutoPragaComNomes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([listGraos(), listProdutos(), listAllProdutoPragasComNomes()])
      .then(([g, p, d]) => {
        setGraos(g)
        setProdutos(p)
        setDiluicoes(d)
      })
      .catch(() => setError('Não foi possível carregar o catálogo.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold">Lista</h1>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('graos')}
          className="rounded-full px-4 py-1.5 text-sm font-medium"
          style={tab === 'graos' ? { background: 'var(--color-grao)', color: 'var(--color-on-accent)' } : { background: 'var(--color-surface)', opacity: 0.7, border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
        >
          Grãos
        </button>
        <button
          type="button"
          onClick={() => setTab('produtos')}
          className="rounded-full px-4 py-1.5 text-sm font-medium"
          style={tab === 'produtos' ? { background: 'var(--color-diluicao)', color: 'var(--color-on-accent)' } : { background: 'var(--color-surface)', opacity: 0.7, border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
        >
          Produtos
        </button>
      </div>

      {error && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-alerta)' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm opacity-60">Carregando…</p>
      ) : tab === 'graos' ? (
        graos.length === 0 ? (
          <p className="text-sm opacity-60">Nenhum grão cadastrado ainda.</p>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
            {graos.map((g) => (
              <li key={g.id} className="py-3">
                <p className="font-medium">{g.nome}</p>
                <p className="text-xs opacity-60">
                  {g.densidade_aparente_kg_m3} kg/m³ · saca {g.peso_saca_kg} kg · {g.dosagem_fumigante_g_m3} g/m³
                </p>
              </li>
            ))}
          </ul>
        )
      ) : produtos.length === 0 ? (
        <p className="text-sm opacity-60">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {produtos.map((produto) => {
            const rels = diluicoes.filter((d) => d.produto_id === produto.id)
            return (
              <div key={produto.id} className="rounded-lg p-3" style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
                <p className="font-medium">{produto.nome}</p>
                {produto.ingrediente_ativo && <p className="mb-2 text-xs opacity-60">{produto.ingrediente_ativo}</p>}
                {rels.length === 0 ? (
                  <p className="text-xs opacity-60">Sem diluições cadastradas.</p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-1">
                    {rels.map((r) => (
                      <li key={r.id} className="text-xs opacity-80">
                        <span className="font-medium">{r.praga_nome}</span>
                        {r.metodo_aplicacao && ` · ${r.metodo_aplicacao}`}: {r.dose_produto} {r.unidade_dose} / {r.volume_diluente_l} L de {r.tipo_diluente} / {r.area_m2} m²
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
