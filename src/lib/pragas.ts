import type { Praga } from '../types/praga'
import { supabase } from './supabaseClient'

export type PragaInput = Omit<Praga, 'id' | 'created_at'>

export async function listPragas(): Promise<Praga[]> {
  const { data, error } = await supabase.from('pragas').select('*').order('classe').order('nome')
  if (error) throw error
  return data
}

export async function createPraga(input: PragaInput): Promise<Praga> {
  const { data, error } = await supabase.from('pragas').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updatePraga(id: string, input: PragaInput): Promise<Praga> {
  const { data, error } = await supabase.from('pragas').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePraga(id: string): Promise<void> {
  const { error } = await supabase.from('pragas').delete().eq('id', id)
  if (error) throw error
}
