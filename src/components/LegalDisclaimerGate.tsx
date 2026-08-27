import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'd-dose-aviso-aceito'

export function LegalDisclaimerGate({ children }: { children: ReactNode }) {
  const [aceito, setAceito] = useState(true)

  useEffect(() => {
    setAceito(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  const aceitar = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setAceito(true)
  }

  return (
    <>
      {children}
      {!aceito && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg p-5" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
            <h2 className="mb-3 text-lg font-bold" style={{ color: 'var(--color-alerta)' }}>
              Antes de continuar
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <p>
                O uso de fosfina e de produtos de desinsetização é <strong>restrito a aplicadores habilitados</strong>.
                Os cálculos deste app são um apoio e não substituem a bula do produto, a orientação técnica nem os
                EPIs indicados.
              </p>
              <p>Use por sua conta e risco. Confira sempre a bula original antes de aplicar qualquer produto.</p>
            </div>
            <button
              type="button"
              onClick={aceitar}
              className="mt-4 w-full rounded py-2 font-medium text-white"
              style={{ background: 'var(--color-alerta)' }}
            >
              Estou ciente e concordo
            </button>
          </div>
        </div>
      )}
    </>
  )
}
