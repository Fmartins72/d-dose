export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits, minimumFractionDigits: 2 })
}
