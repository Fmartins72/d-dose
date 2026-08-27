interface UnitToggleProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  accent: string
}

export function UnitToggle<T extends string>({ options, value, onChange, accent }: UnitToggleProps<T>) {
  return (
    <div className="inline-flex rounded-full p-1" style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className="rounded-full px-4 py-1 text-sm font-medium"
          style={
            option.value === value
              ? { background: accent, color: 'var(--color-on-accent)' }
              : { color: 'var(--color-text)', opacity: 0.6 }
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
