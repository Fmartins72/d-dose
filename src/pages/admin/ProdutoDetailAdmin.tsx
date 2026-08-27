import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { listPragas } from '../../lib/pragas'
import {
  createProdutoPraga,
  deleteProdutoPraga,
  getProduto,
  listProdutoPragasByProduto,
  updateProdutoPraga,
} from '../../lib/produtos'
import type { Praga } from '../../types/praga'
import { METODOS_APLICACAO, type Produto, type ProdutoPraga } from '../../types/produto'

const OUTRO = 'Outro'

const emptyForm = {
  praga_id: '',
  metodo_aplicacao: '',
  dose_produto: '',
  unidade_dose: 'mL' as 'mL' | 'L',
  volume_diluente_l: '',
  tipo_diluente: 'Água',
  area_m2: '',
}

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}

export function ProdutoDetailAdmin() {
  const { id } = useParams<{ id: string }>()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [pragas, setPragas] = useState<Praga[]>([])
  const [relacoes, setRelacoes] = useState<ProdutoPraga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [metodoCustom, setMetodoCustom] = useState(false)

  const load = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [p, allPragas, rels] = await Promise.all([getProduto(id), listPragas(), listProdutoPragasByProduto(id)])
      setProduto(p)
      setPragas(allPragas)
      setRelacoes(rels)
      setError(null)
    } catch {
      setError('Não foi possível carregar os dados do produto.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const startEdit = (rel: ProdutoPraga) => {
    setEditingId(rel.id)
    setForm({
      praga_id: rel.praga_id,
      metodo_aplicacao: rel.metodo_aplicacao ?? '',
      dose_produto: String(rel.dose_produto),
      unidade_dose: rel.unidade_dose,
      volume_diluente_l: String(rel.volume_diluente_l),
      tipo_diluente: rel.tipo_diluente,
      area_m2: String(rel.area_m2),
    })
    setMetodoCustom(!!rel.metodo_aplicacao && !METODOS_APLICACAO.includes(rel.metodo_aplicacao as (typeof METODOS_APLICACAO)[number]))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMetodoCustom(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)
    const input = {
      produto_id: id,
      praga_id: form.praga_id,
      metodo_aplicacao: form.metodo_aplicacao.trim() || null,
      dose_produto: Number(form.dose_produto),
      unidade_dose: form.unidade_dose,
      volume_diluente_l: Number(form.volume_diluente_l),
      tipo_diluente: form.tipo_diluente.trim() || 'Água',
      area_m2: Number(form.area_m2),
    }
    try {
      if (editingId) {
        await updateProdutoPraga(editingId, input)
      } else {
        await createProdutoPraga(input)
      }
      cancelEdit()
      await load()
    } catch {
      setError('Não foi possível salvar a diluição. Confira se essa praga já não está cadastrada para esse produto/método.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (rel: ProdutoPraga) => {
    if (!window.confirm('Excluir essa diluição?')) return
    try {
      await deleteProdutoPraga(rel.id)
      await load()
    } catch {
      setError('Não foi possível excluir a diluição.')
    }
  }

  const nomePraga = (pragaId: string) => pragas.find((p) => p.id === pragaId)?.nome ?? 'Praga removida'

  if (loading) return <p className="text-sm opacity-60">Carregando…</p>
  if (!produto) return <p className="text-sm opacity-60">Produto não encontrado.</p>

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/produtos" className="mb-2 inline-block text-sm" style={{ color: 'var(--color-diluicao)' }}>
        ← Voltar para produtos
      </Link>
      <h1 className="mb-1 text-xl font-bold">{produto.nome}</h1>
      {produto.ingrediente_ativo && <p className="mb-4 text-sm opacity-60">{produto.ingrediente_ativo}</p>}

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <div className="col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="praga">
            Praga
          </label>
          <select id="praga" required value={form.praga_id} onChange={(e) => setForm({ ...form, praga_id: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle}>
            <option value="" disabled>
              Selecione…
            </option>
            {pragas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.classe})
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="metodo">
            Método de aplicação (opcional)
          </label>
          <select
            id="metodo"
            value={metodoCustom ? OUTRO : form.metodo_aplicacao}
            onChange={(e) => {
              if (e.target.value === OUTRO) {
                setMetodoCustom(true)
                setForm({ ...form, metodo_aplicacao: '' })
              } else {
                setMetodoCustom(false)
                setForm({ ...form, metodo_aplicacao: e.target.value })
              }
            }}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          >
            <option value="">Não especificado</option>
            {METODOS_APLICACAO.map((metodo) => (
              <option key={metodo} value={metodo}>
                {metodo}
              </option>
            ))}
            <option value={OUTRO}>Outro…</option>
          </select>
          {metodoCustom && (
            <input
              autoFocus
              placeholder="Especifique o método"
              value={form.metodo_aplicacao}
              onChange={(e) => setForm({ ...form, metodo_aplicacao: e.target.value })}
              className="mt-2 w-full rounded border px-3 py-2"
              style={inputStyle}
            />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="dose">
            Dose do produto
          </label>
          <input id="dose" type="number" inputMode="decimal" step="0.01" min="0.01" required value={form.dose_produto} onChange={(e) => setForm({ ...form, dose_produto: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="unidade">
            Unidade
          </label>
          <select id="unidade" value={form.unidade_dose} onChange={(e) => setForm({ ...form, unidade_dose: e.target.value as 'mL' | 'L' })} className="w-full rounded border px-3 py-2" style={inputStyle}>
            <option value="mL">mL</option>
            <option value="L">L</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="diluente">
            Quantidade de diluente (L)
          </label>
          <input id="diluente" type="number" inputMode="decimal" step="0.01" min="0.01" required value={form.volume_diluente_l} onChange={(e) => setForm({ ...form, volume_diluente_l: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="tipoDiluente">
            Tipo de diluente
          </label>
          <input id="tipoDiluente" placeholder="Ex: Água, Óleo mineral" required value={form.tipo_diluente} onChange={(e) => setForm({ ...form, tipo_diluente: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="area">
            Área coberta (m²)
          </label>
          <input id="area" type="number" inputMode="decimal" step="0.01" min="0.01" required value={form.area_m2} onChange={(e) => setForm({ ...form, area_m2: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 rounded px-4 py-2 font-medium text-white disabled:opacity-60"
            style={{ background: 'var(--color-diluicao)' }}
          >
            <Plus size={16} />
            {editingId ? (saving ? 'Salvando…' : 'Salvar alterações') : saving ? 'Adicionando…' : 'Adicionar diluição'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded px-4 py-2 font-medium" style={{ color: 'var(--color-text)' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-alerta)' }}>
          {error}
        </p>
      )}

      {relacoes.length === 0 ? (
        <p className="text-sm opacity-60">Nenhuma diluição cadastrada para este produto ainda.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
          {relacoes.map((rel) => (
            <li key={rel.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">
                  {nomePraga(rel.praga_id)}
                  {rel.metodo_aplicacao && <span className="opacity-60"> · {rel.metodo_aplicacao}</span>}
                </p>
                <p className="text-xs opacity-60">
                  {rel.dose_produto} {rel.unidade_dose} / {rel.volume_diluente_l} L de {rel.tipo_diluente} / {rel.area_m2} m²
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(rel)} aria-label="Editar diluição" style={{ color: 'var(--color-diluicao)' }}>
                  <Pencil size={18} />
                </button>
                <button type="button" onClick={() => handleDelete(rel)} aria-label="Excluir diluição" style={{ color: 'var(--color-alerta)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
