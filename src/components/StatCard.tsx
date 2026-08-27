interface StatCardProps {
  label: string
  value: string
  unit: string
  highlight?: boolean
  accent: string
}

export function StatCard({ label, value, unit, highlight, accent }: StatCardProps) {
  return (
    <div
      className="rounded-lg p-3"
      style={
        highlight
          ? { background: accent, color: '#fff' }
          : { background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }
      }
    >
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-lg font-bold">
        {value} <span className="text-sm font-medium opacity-80">{unit}</span>
      </p>
    </div>
  )
}
