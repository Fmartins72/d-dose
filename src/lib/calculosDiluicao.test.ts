import { describe, expect, it } from 'vitest'

import { calcularDiluicao } from './calculosDiluicao'

// Referência do rótulo Bergard (Baratas, Pulverização): 80 mL / 10 L de água / 200 m².

const referenciaBergardBaratas = { doseProduto: 80, volumeDiluenteL: 10, areaM2: 200 }

describe('calcularDiluicao', () => {
  it('calcula a partir da área desejada', () => {
    const resultado = calcularDiluicao('area', 250, referenciaBergardBaratas)

    expect(resultado.produto).toBeCloseTo(100, 6)
    expect(resultado.diluenteL).toBeCloseTo(12.5, 6)
    expect(resultado.areaM2).toBeCloseTo(250, 6)
  })

  it('calcula a partir da quantidade de produto desejada', () => {
    const resultado = calcularDiluicao('produto', 100, referenciaBergardBaratas)

    expect(resultado.diluenteL).toBeCloseTo(12.5, 6)
    expect(resultado.areaM2).toBeCloseTo(250, 6)
  })

  it('é consistente: informar a área ou o produto equivalente dá o mesmo resultado', () => {
    const porArea = calcularDiluicao('area', 200, referenciaBergardBaratas)
    const porProduto = calcularDiluicao('produto', 80, referenciaBergardBaratas)

    expect(porArea).toEqual(porProduto)
  })
})
