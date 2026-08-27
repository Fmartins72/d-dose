import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from './auth/RequireAuth'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { AvisoLegal } from './pages/AvisoLegal'
import { Dashboard } from './pages/Dashboard'
import { Diluicoes } from './pages/Diluicoes'
import { Lista } from './pages/Lista'
import { ExpurgoScreen } from './pages/expurgo/ExpurgoScreen'
import { GraosAdmin } from './pages/admin/GraosAdmin'
import { Login } from './pages/admin/Login'
import { PragasAdmin } from './pages/admin/PragasAdmin'
import { ProdutoDetailAdmin } from './pages/admin/ProdutoDetailAdmin'
import { ProdutosAdmin } from './pages/admin/ProdutosAdmin'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="expurgo" element={<ExpurgoScreen />} />
        <Route path="diluicoes" element={<Diluicoes />} />
        <Route path="lista" element={<Lista />} />
        <Route path="aviso-legal" element={<AvisoLegal />} />
      </Route>

      <Route path="admin/login" element={<Login />} />
      <Route
        path="admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<GraosAdmin />} />
        <Route path="pragas" element={<PragasAdmin />} />
        <Route path="produtos" element={<ProdutosAdmin />} />
        <Route path="produtos/:id" element={<ProdutoDetailAdmin />} />
      </Route>
    </Routes>
  )
}

export default App
