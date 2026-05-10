import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CadastroPage from '@/pages/CadastroPage'
import TurmasPage from '@/pages/TurmasPage'
import RankingPage from '@/pages/RankingPage'
import RelatoriosPage from '@/pages/RelatoriosPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-navy-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-4">🚀</div>
        <p className="text-sm text-white/60">Carregando OBAFOG 2026...</p>
      </div>
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="cadastro" element={<CadastroPage />} />
        <Route path="turmas" element={<TurmasPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
