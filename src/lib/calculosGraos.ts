export interface ParametrosGrao {
  densidadeAparenteKgM3: number
  pesoSacaKg: number
  dosagemFumiganteGM3: number
}

export interface ResultadoGraos {
  toneladas: number
  sacas: number
  volumeM3: number
  fosfinaKg: number
}

function resultadoAPartirDoVolume(volumeM3: number, params: ParametrosGrao): ResultadoGraos {
  const toneladas = (volumeM3 * params.densidadeAparenteKgM3) / 1000
  const sacas = (toneladas * 1000) / params.pesoSacaKg
  const fosfinaKg = (volumeM3 * params.dosagemFumiganteGM3) / 1000
  return { toneladas, sacas, volumeM3, fosfinaKg }
}

export type UnidadeQuantidade = 'sacas' | 'toneladas'

export function calcularExpurgo(unidade: UnidadeQuantidade, quantidade: number, params: ParametrosGrao): ResultadoGraos {
  const toneladas = unidade === 'toneladas' ? quantidade : (quantidade * params.pesoSacaKg) / 1000
  const volumeM3 = (toneladas * 1000) / params.densidadeAparenteKgM3
  return resultadoAPartirDoVolume(volumeM3, params)
}

export function calcularVolumeSilo(diametro: number, alturaGraos: number, alturaCone: number, params: ParametrosGrao): ResultadoGraos {
  const raio = diametro / 2
  const volumeCilindro = Math.PI * raio ** 2 * alturaGraos
  const volumeCone = alturaCone > 0 ? (Math.PI * raio ** 2 * alturaCone) / 3 : 0
  return resultadoAPartirDoVolume(volumeCilindro + volumeCone, params)
}

export function calcularPilha(comprimento: number, largura: number, altura: number, params: ParametrosGrao): ResultadoGraos {
  const volumeM3 = comprimento * largura * altura
  return resultadoAPartirDoVolume(volumeM3, params)
}
