import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { createPraga, deletePraga, listPragas, updatePraga } from '../../lib/pragas'
import { CLASSES_PRAGA, type ClassePraga, type Praga } from '../../types/praga'

const emptyForm: { nome: string; classe: ClassePraga } = {
  nome: '',
  classe: CLASSES_PRAGA[0],
}

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}

export function PragasAdmin() {
  const [pragas, setPragas] = useState<Praga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadPragas = async () => {
    setLoading(true)
    try {
      setPragas(await listPragas())
      setError(null)
    } catch {
      setError('Não foi possível carregar as pragas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPragas()
  }, [])

  const startEdit = (praga: Praga) => {
    setEditingId(praga.id)
    setForm({ nome: praga.nome, classe: praga.classe })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const input = { nome: form.nome.trim(), classe: form.classe }
    try {
      if (editingId) {
        await updatePraga(editingId, input)
      } else {
        await createPraga(input)
      }
      cancelEdit()
      await loadPragas()
    } catch {
      setError('Não foi possível salvar a praga.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (praga: Praga) => {
    if (!window.confirm(`Excluir "${praga.nome}"? Essa ação não pode ser desfeita.`)) return
    try {
      await deletePraga(praga.id)
      await loadPragas()
    } catch {
      setError('Não foi possível excluir a praga. Verifique se ela ainda está associada a algum produto.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Pragas</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="nome">
            Nome da praga
          </label>
          <input
            id="nome"
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="classe">
            Classe
          </label>
          <select
            id="classe"
            value={form.classe}
            onChange={(e) => setForm({ ...form, classe: e.target.value as ClassePraga })}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          >
            {CLASSES_PRAGA.map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 rounded px-4 py-2 font-medium disabled:opacity-60"
            style={{ background: 'var(--color-diluicao)', color: 'var(--color-on-accent)' }}
          >
            <Plus size={16} />
            {editingId ? (saving ? 'Salvando…' : 'Salvar alterações') : saving ? 'Adicionando…' : 'Adicionar praga'}
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

      {loading ? (
        <p className="text-sm opacity-60">Carregando…</p>
      ) : pragas.length === 0 ? (
        <p className="text-sm opacity-60">Nenhuma praga cadastrada ainda.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
          {pragas.map((praga) => (
            <li key={praga.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{praga.nome}</p>
                <p className="text-xs opacity-60">{praga.classe}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(praga)} aria-label={`Editar ${praga.nome}`} style={{ color: 'var(--color-diluicao)' }}>
                  <Pencil size={18} />
                </button>
                <button type="button" onClick={() => handleDelete(praga)} aria-label={`Excluir ${praga.nome}`} style={{ color: 'var(--color-alerta)' }}>
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
