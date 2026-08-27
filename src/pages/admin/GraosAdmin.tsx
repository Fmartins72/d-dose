import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { createGrao, deleteGrao, listGraos, updateGrao } from '../../lib/graos'
import type { Grao } from '../../types/grao'

const emptyForm = {
  nome: '',
  densidade_aparente_kg_m3: '',
  peso_saca_kg: '',
  dosagem_fumigante_g_m3: '6',
}

const inputStyle = {
  borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}

export function GraosAdmin() {
  const [graos, setGraos] = useState<Grao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadGraos = async () => {
    setLoading(true)
    try {
      setGraos(await listGraos())
      setError(null)
    } catch {
      setError('Não foi possível carregar os grãos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGraos()
  }, [])

  const startEdit = (grao: Grao) => {
    setEditingId(grao.id)
    setForm({
      nome: grao.nome,
      densidade_aparente_kg_m3: String(grao.densidade_aparente_kg_m3),
      peso_saca_kg: String(grao.peso_saca_kg),
      dosagem_fumigante_g_m3: String(grao.dosagem_fumigante_g_m3),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const input = {
      nome: form.nome.trim(),
      densidade_aparente_kg_m3: Number(form.densidade_aparente_kg_m3),
      peso_saca_kg: Number(form.peso_saca_kg),
      dosagem_fumigante_g_m3: Number(form.dosagem_fumigante_g_m3),
    }
    try {
      if (editingId) {
        await updateGrao(editingId, input)
      } else {
        await createGrao(input)
      }
      cancelEdit()
      await loadGraos()
    } catch {
      setError('Não foi possível salvar o grão. Confira os valores informados.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (grao: Grao) => {
    if (!window.confirm(`Excluir "${grao.nome}"? Essa ação não pode ser desfeita.`)) return
    try {
      await deleteGrao(grao.id)
      await loadGraos()
    } catch {
      setError('Não foi possível excluir o grão.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Grãos</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <div className="col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="nome">
            Nome da cultura
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
          <label className="mb-1 block text-sm font-medium" htmlFor="densidade">
            Densidade aparente (kg/m³)
          </label>
          <input
            id="densidade"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.densidade_aparente_kg_m3}
            onChange={(e) => setForm({ ...form, densidade_aparente_kg_m3: e.target.value })}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="saca">
            Peso da saca (kg)
          </label>
          <input
            id="saca"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.peso_saca_kg}
            onChange={(e) => setForm({ ...form, peso_saca_kg: e.target.value })}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="dosagem">
            Dosagem de fumigante (g/m³)
          </label>
          <input
            id="dosagem"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.dosagem_fumigante_g_m3}
            onChange={(e) => setForm({ ...form, dosagem_fumigante_g_m3: e.target.value })}
            className="w-full rounded border px-3 py-2"
            style={inputStyle}
          />
        </div>

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 rounded px-4 py-2 font-medium disabled:opacity-60"
            style={{ background: 'var(--color-grao)', color: 'var(--color-on-accent)' }}
          >
            <Plus size={16} />
            {editingId ? (saving ? 'Salvando…' : 'Salvar alterações') : saving ? 'Adicionando…' : 'Adicionar grão'}
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
      ) : graos.length === 0 ? (
        <p className="text-sm opacity-60">Nenhum grão cadastrado ainda.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
          {graos.map((grao) => (
            <li key={grao.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{grao.nome}</p>
                <p className="text-xs opacity-60">
                  {grao.densidade_aparente_kg_m3} kg/m³ · saca {grao.peso_saca_kg} kg · {grao.dosagem_fumigante_g_m3} g/m³
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(grao)} aria-label={`Editar ${grao.nome}`} style={{ color: 'var(--color-diluicao)' }}>
                  <Pencil size={18} />
                </button>
                <button type="button" onClick={() => handleDelete(grao)} aria-label={`Excluir ${grao.nome}`} style={{ color: 'var(--color-alerta)' }}>
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
