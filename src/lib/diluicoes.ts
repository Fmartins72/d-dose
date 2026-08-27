import type { ProdutoPraga } from '../types/produto'
import { supabase } from './supabaseClient'

export interface ProdutoPragaComNome extends ProdutoPraga {
  produto_nome: string
}

export async function listProdutoPragasComNomeByPraga(pragaId: string): Promise<ProdutoPragaComNome[]> {
  const { data, error } = await supabase
    .from('produto_pragas')
    .select('*, produtos(nome)')
    .eq('praga_id', pragaId)
  if (error) throw error
  return data.map((row) => {
    const { produtos, ...rest } = row as ProdutoPraga & { produtos: { nome: string } }
    return { ...rest, produto_nome: produtos.nome }
  })
}
