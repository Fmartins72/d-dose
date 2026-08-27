import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../../auth/AuthContext'

export function Login() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('E-mail ou senha inválidos.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg p-6"
        style={{ background: 'var(--color-surface)', border: '1px solid color-mix(in srgb, var(--color-text) 12%, transparent)' }}
      >
        <h1 className="mb-4 text-lg font-bold">Painel administrativo</h1>

        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border px-3 py-2"
          style={{ borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
          style={{ borderColor: 'color-mix(in srgb, var(--color-text) 20%, transparent)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />

        {error && (
          <p className="mb-3 text-sm" style={{ color: 'var(--color-alerta)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded py-2 font-medium disabled:opacity-60"
          style={{ background: 'var(--color-grao)', color: 'var(--color-on-accent)' }}
        >
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
