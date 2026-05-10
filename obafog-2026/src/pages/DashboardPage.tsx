import { useAuth } from '@/contexts/AuthContext'
import { useEstatisticas } from '@/hooks/useObafog'
import { Users, School, Users2, BookOpen, Activity, Trophy, FileText } from 'lucide-react'

const HORA = new Date().getHours()
const SAUDACAO = HORA < 12 ? 'Bom dia' : HORA < 18 ? 'Boa tarde' : 'Boa noite'

export default function DashboardPage() {
  const { usuario } = useAuth()
  const { data: stats, isLoading } = useEstatisticas()

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'Coordenador'

  const metricas = [
    { label: 'Alunos',    value: stats?.total_alunos ?? 0,    Icon: Users,    highlight: true },
    { label: 'Equipes',   value: stats?.total_equipes ?? 0,   Icon: Users2,   highlight: false },
    { label: 'Escolas',   value: stats?.total_escolas ?? 0,   Icon: School,   highlight: false },
    { label: 'Turmas',    value: stats?.total_turmas ?? 0,    Icon: BookOpen, highlight: false },
  ]

  const pctCadastros = stats ? Math.round((stats.total_alunos / 1160) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Saudação */}
      <div>
        <h2 className="text-lg font-extrabold text-navy-600">
          {SAUDACAO}, Prof. {primeiroNome}! 👋
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Olimpíada de Foguetes 2026 • Atualizado agora
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2.5">
        {metricas.map(({ label, value, Icon, highlight }) => (
          <div key={label} className={`rounded-2xl p-4 ${highlight ? 'bg-navy-600' : 'bg-white border border-gray-200'}`}>
            <div className={`flex items-center gap-1.5 mb-1 ${highlight ? 'text-white/60' : 'text-gray-500'}`}>
              <Icon size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <div className={`text-3xl font-extrabold leading-none ${highlight ? 'text-gold-400' : 'text-navy-600'}`}>
              {isLoading ? '—' : value.toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      {/* Progresso de cadastros */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-600">Cadastros concluídos</span>
          <span className="text-sm font-extrabold text-navy-600">{pctCadastros}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-navy-600 to-navy-400 rounded-full transition-all duration-700"
            style={{ width: `${pctCadastros}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          Meta: 1.160 alunos até 30/jun/2026
        </p>
      </div>

      {/* Equipes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-gray-600">Fase classificatória</span>
          <span className="text-sm font-extrabold text-gold-600">45%</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-green-50 rounded-xl p-2">
            <div className="text-lg font-extrabold text-green-700">{stats?.equipes_completas ?? 0}</div>
            <div className="text-[10px] text-green-600 font-semibold">Completas</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-2">
            <div className="text-lg font-extrabold text-blue-700">{stats?.equipes_classificadas ?? 0}</div>
            <div className="text-[10px] text-blue-600 font-semibold">Classificadas</div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Final estadual: 15/ago/2026 • Belém-PA
        </p>
      </div>

      {/* Atividade recente */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-navy-600">Atividade Recente</p>
        </div>
        <div className="space-y-2">
          {[
            { Icon: Users,   color: 'bg-yellow-50 text-yellow-700', title: '14 alunos importados', sub: 'EEM Grão-Pará • Belém', time: '2min' },
            { Icon: Trophy,  color: 'bg-blue-50 text-blue-700',     title: 'Ranking atualizado',  sub: 'Fase 2 • Categoria Médio', time: '18min' },
            { Icon: FileText,color: 'bg-green-50 text-green-700',   title: 'Relatório gerado',    sub: 'Município Santarém • PDF', time: '1h' },
            { Icon: Activity,color: 'bg-purple-50 text-purple-700', title: 'Nova equipe cadastrada', sub: 'Equipe Saturno • Marabá', time: '2h' },
          ].map(({ Icon, color, title, sub, time }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-navy-600 truncate">{title}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
