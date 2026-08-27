export interface Produto {
  id: string
  nome: string
  ingrediente_ativo: string | null
  created_at: string
}

export interface ProdutoPraga {
  id: string
  produto_id: string
  praga_id: string
  metodo_aplicacao: string | null
  dose_produto: number
  unidade_dose: 'mL' | 'L'
  volume_diluente_l: number
  tipo_diluente: string
  area_m2: number
  created_at: string
}
