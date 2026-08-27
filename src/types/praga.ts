export const CLASSES_PRAGA = ['Insetos Rasteiros', 'Insetos Voadores', 'Demais Pragas', 'Grãos Armazenados'] as const

export type ClassePraga = (typeof CLASSES_PRAGA)[number]

export interface Praga {
  id: string
  nome: string
  classe: ClassePraga
  created_at: string
}
