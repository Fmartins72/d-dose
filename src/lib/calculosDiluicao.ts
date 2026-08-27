export interface ReferenciaDiluicao {
  doseProduto: number
  volumeDiluenteL: number
  areaM2: number
}

export interface ResultadoDiluicao {
  produto: number
  diluenteL: number
  areaM2: number
}

export type UnidadeEntradaDiluicao = 'area' | 'produto'

export function calcularDiluicao(unidadeEntrada: UnidadeEntradaDiluicao, valor: number, referencia: ReferenciaDiluicao): ResultadoDiluicao {
  const fator = unidadeEntrada === 'area' ? valor / referencia.areaM2 : valor / referencia.doseProduto

  return {
    produto: fator * referencia.doseProduto,
    diluenteL: fator * referencia.volumeDiluenteL,
    areaM2: fator * referencia.areaM2,
  }
}
