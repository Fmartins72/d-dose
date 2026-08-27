import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from './auth/RequireAuth'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Diluicoes } from './pages/Diluicoes'
import { Expurgo } from './pages/Expurgo'
import { Lista } from './pages/Lista'
import { GraosAdmin } from './pages/admin/GraosAdmin'
import { Login } from './pages/admin/Login'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="expurgo" element={<Expurgo />} />
        <Route path="diluicoes" element={<Diluicoes />} />
        <Route path="lista" element={<Lista />} />
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
      </Route>
    </Routes>
  )
}

export default App
