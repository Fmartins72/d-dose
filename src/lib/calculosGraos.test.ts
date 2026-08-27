import { describe, expect, it } from 'vitest'

import { calcularExpurgo, calcularPilha, calcularVolumeSilo } from './calculosGraos'

// Parâmetros e resultados esperados conferidos manualmente pelo usuário durante
// o desenvolvimento (Etapa 6), a partir de valores reais de campo.

describe('calcularExpurgo', () => {
  it('calcula a partir de sacas (Arroz em Casca, 5000 sacas)', () => {
    const resultado = calcularExpurgo('sacas', 5000, {
      densidadeAparenteKgM3: 579,
      pesoSacaKg: 50,
      dosagemFumiganteGM3: 6,
    })

    expect(resultado.toneladas).toBeCloseTo(250, 6)
    expect(resultado.sacas).toBe(5000)
    expect(resultado.volumeM3).toBeCloseTo(431.7789, 3)
    expect(resultado.fosfinaKg).toBeCloseTo(2.5907, 3)
  })

  it('calcula a partir de toneladas (mesma proporção, resultado equivalente)', () => {
    const resultado = calcularExpurgo('toneladas', 250, {
      densidadeAparenteKgM3: 579,
      pesoSacaKg: 50,
      dosagemFumiganteGM3: 6,
    })

    expect(resultado.sacas).toBeCloseTo(5000, 6)
    expect(resultado.volumeM3).toBeCloseTo(431.7789, 3)
  })
})

describe('calcularVolumeSilo', () => {
  it('calcula cilindro sem cone (Arroz em Casca, diâmetro 20, altura 19)', () => {
    const resultado = calcularVolumeSilo(20, 19, 0, {
      densidadeAparenteKgM3: 579,
      pesoSacaKg: 50,
      dosagemFumiganteGM3: 6,
    })

    expect(resultado.volumeM3).toBeCloseTo(5969.03, 2)
    expect(resultado.toneladas).toBeCloseTo(3456.07, 2)
    expect(resultado.sacas).toBeCloseTo(69121.32, 2)
    expect(resultado.fosfinaKg).toBeCloseTo(35.814, 3)
  })

  it('soma o volume do cone quando informado', () => {
    const semCone = calcularVolumeSilo(20, 19, 0, {
      densidadeAparenteKgM3: 579,
      pesoSacaKg: 50,
      dosagemFumiganteGM3: 6,
    })
    const comCone = calcularVolumeSilo(20, 19, 3, {
      densidadeAparenteKgM3: 579,
      pesoSacaKg: 50,
      dosagemFumiganteGM3: 6,
    })

    expect(comCone.volumeM3).toBeGreaterThan(semCone.volumeM3)
    // Volume do cone = (pi * raio^2 * altura) / 3
    const volumeConeEsperado = (Math.PI * 10 ** 2 * 3) / 3
    expect(comCone.volumeM3 - semCone.volumeM3).toBeCloseTo(volumeConeEsperado, 6)
  })
})

describe('calcularPilha', () => {
  it('calcula comprimento x largura x altura (Arroz Beneficiado, 10x10x10)', () => {
    const resultado = calcularPilha(10, 10, 10, {
      densidadeAparenteKgM3: 770,
      pesoSacaKg: 60,
      dosagemFumiganteGM3: 6,
    })

    expect(resultado.volumeM3).toBe(1000)
    expect(resultado.toneladas).toBe(770)
    expect(resultado.sacas).toBeCloseTo(12833.33, 2)
    expect(resultado.fosfinaKg).toBeCloseTo(6, 6)
  })
})
