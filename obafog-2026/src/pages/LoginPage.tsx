import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('E-mail ou senha incorretos. Verifique suas credenciais.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-navy-600 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mb-4">
        <Rocket size={32} className="text-navy-600" />
      </div>

      <div className="bg-white/10 text-white/60 text-xs font-semibold px-3 py-1 rounded-md mb-4">
        SEDUC-PA • Olimpíadas 2026
      </div>

      <h1 className="text-white text-2xl font-extrabold text-center">OBAFOG 2026</h1>
      <p className="text-white/50 text-xs text-center mt-1 mb-8">
        Sistema de Gestão da Olimpíada de Foguetes
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-white/70 text-[10px] font-semibold uppercase tracking-wide block mb-1.5">
              E-mail institucional
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@seduc.pa.gov.br"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 pl-9
                           text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-[10px] font-semibold uppercase tracking-wide block mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 pl-9
                           text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold-500 text-navy-600 rounded-xl font-extrabold text-sm
                       hover:bg-gold-400 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </div>
      </form>

      <p className="text-white/30 text-[10px] text-center mt-6">
        Acesso restrito a coordenadores e professores credenciados<br />
        SEDUC-PA © 2026
      </p>
    </div>
  )
}
