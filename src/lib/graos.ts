import type { Grao } from '../types/grao'
import { supabase } from './supabaseClient'

export type GraoInput = Omit<Grao, 'id' | 'created_at'>

export async function listGraos(): Promise<Grao[]> {
  const { data, error } = await supabase.from('graos').select('*').order('nome')
  if (error) throw error
  return data
}

export async function createGrao(input: GraoInput): Promise<Grao> {
  const { data, error } = await supabase.from('graos').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateGrao(id: string, input: GraoInput): Promise<Grao> {
  const { data, error } = await supabase.from('graos').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGrao(id: string): Promise<void> {
  const { error } = await supabase.from('graos').delete().eq('id', id)
  if (error) throw error
}
