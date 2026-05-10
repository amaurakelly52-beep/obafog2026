import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, UserPlus, Users, Trophy, FileText, LogOut, Rocket } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { to: '/',          label: 'Dashboard',  Icon: LayoutDashboard, end: true },
  { to: '/cadastro',  label: 'Cadastro',   Icon: UserPlus },
  { to: '/turmas',    label: 'Turmas',     Icon: Users },
  { to: '/ranking',   label: 'Ranking',    Icon: Trophy },
  { to: '/relatorios',label: 'Relatórios', Icon: FileText },
]

export default function Layout() {
  const { usuario, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const initials = usuario?.nome
    ? usuario.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'US'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-screen-sm mx-auto">
      {/* Header */}
      <header className="bg-navy-600 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <Rocket size={16} className="text-navy-600" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">OBAFOG 2026</p>
              <p className="text-white/50 text-[10px]">SEDUC-PA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-[11px] font-bold text-navy-600">
              {initials}
            </div>
            <button onClick={handleSignOut} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Bottom nav */}
        <nav className="flex border-t border-white/10">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-[10px] font-semibold border-b-2 transition-colors ${
                  isActive
                    ? 'text-gold-400 border-gold-400'
                    : 'text-white/50 border-transparent hover:text-white/80'
                }`
              }
            >
              <Icon size={16} className="mb-0.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
