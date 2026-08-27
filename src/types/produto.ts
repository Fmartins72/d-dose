export const METODOS_APLICACAO = [
  'Pulverização',
  'Termonebulização (FOG)',
  'UBV (Ultra Baixo Volume)',
  'Aspersão',
  'Polvilhamento',
  'Iscagem',
] as const

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
