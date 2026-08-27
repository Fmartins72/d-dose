import { FlaskConical, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { createProduto, deleteProduto, listProdutos } from '../../lib/produtos'
import type { Produto } from '../../types/produto'

const emptyForm = { nome: '', ingrediente_ativo: '' }

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}

export function ProdutosAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadProdutos = async () => {
    setLoading(true)
    try {
      setProdutos(await listProdutos())
      setError(null)
    } catch {
      setError('Não foi possível carregar os produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProdutos()
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createProduto({ nome: form.nome.trim(), ingrediente_ativo: form.ingrediente_ativo.trim() || null })
      setForm(emptyForm)
      await loadProdutos()
    } catch {
      setError('Não foi possível salvar o produto.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (produto: Produto) => {
    if (!window.confirm(`Excluir "${produto.nome}"? Isso remove também suas diluições cadastradas.`)) return
    try {
      await deleteProduto(produto.id)
      await loadProdutos()
    } catch {
      setError('Não foi possível excluir o produto.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Produtos</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="nome">
            Nome do produto
          </label>
          <input id="nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="ingrediente">
            Ingrediente ativo (opcional)
          </label>
          <input id="ingrediente" value={form.ingrediente_ativo} onChange={(e) => setForm({ ...form, ingrediente_ativo: e.target.value })} className="w-full rounded border px-3 py-2" style={inputStyle} />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 rounded px-4 py-2 font-medium text-white disabled:opacity-60"
            style={{ background: 'var(--color-diluicao)' }}
          >
            <Plus size={16} />
            {saving ? 'Adicionando…' : 'Adicionar produto'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-alerta)' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm opacity-60">Carregando…</p>
      ) : produtos.length === 0 ? (
        <p className="text-sm opacity-60">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
          {produtos.map((produto) => (
            <li key={produto.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{produto.nome}</p>
                {produto.ingrediente_ativo && <p className="text-xs opacity-60">{produto.ingrediente_ativo}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/admin/produtos/${produto.id}`} className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-diluicao)' }}>
                  <FlaskConical size={16} />
                  Diluições
                </Link>
                <button type="button" onClick={() => handleDelete(produto)} aria-label={`Excluir ${produto.nome}`} style={{ color: 'var(--color-alerta)' }}>
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
