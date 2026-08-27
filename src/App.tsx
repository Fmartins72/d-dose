import { Route, Routes } from 'react-router-dom'

import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Diluicoes } from './pages/Diluicoes'
import { Expurgo } from './pages/Expurgo'
import { Lista } from './pages/Lista'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="expurgo" element={<Expurgo />} />
        <Route path="diluicoes" element={<Diluicoes />} />
        <Route path="lista" element={<Lista />} />
      </Route>
    </Routes>
  )
}

export default App
