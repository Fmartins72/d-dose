import type { Produto, ProdutoPraga } from '../types/produto'
import { supabase } from './supabaseClient'

export type ProdutoInput = Omit<Produto, 'id' | 'created_at'>
export type ProdutoPragaInput = Omit<ProdutoPraga, 'id' | 'created_at'>

export async function listProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase.from('produtos').select('*').order('nome')
  if (error) throw error
  return data
}

export async function getProduto(id: string): Promise<Produto> {
  const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createProduto(input: ProdutoInput): Promise<Produto> {
  const { data, error } = await supabase.from('produtos').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateProduto(id: string, input: ProdutoInput): Promise<Produto> {
  const { data, error } = await supabase.from('produtos').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduto(id: string): Promise<void> {
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) throw error
}

export async function listProdutoPragasByProduto(produtoId: string): Promise<ProdutoPraga[]> {
  const { data, error } = await supabase.from('produto_pragas').select('*').eq('produto_id', produtoId)
  if (error) throw error
  return data
}

export async function listProdutoPragasByPraga(pragaId: string): Promise<ProdutoPraga[]> {
  const { data, error } = await supabase.from('produto_pragas').select('*').eq('praga_id', pragaId)
  if (error) throw error
  return data
}

export async function createProdutoPraga(input: ProdutoPragaInput): Promise<ProdutoPraga> {
  const { data, error } = await supabase.from('produto_pragas').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateProdutoPraga(id: string, input: ProdutoPragaInput): Promise<ProdutoPraga> {
  const { data, error } = await supabase.from('produto_pragas').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProdutoPraga(id: string): Promise<void> {
  const { error } = await supabase.from('produto_pragas').delete().eq('id', id)
  if (error) throw error
}
