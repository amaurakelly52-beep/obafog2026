import { useState } from 'react'
import { Pencil, Trash2, Plus, Users } from 'lucide-react'
import { useEquipes, useDeleteEquipe } from '@/hooks/useObafog'

const STATUS_CONFIG = {
  completa:     { label: 'Completa',     cls: 'badge-success' },
  incompleta:   { label: 'Incompleta',   cls: 'badge-warn' },
  classificada: { label: 'Classificada', cls: 'badge-info' },
  eliminada:    { label: 'Eliminada',    cls: 'bg-gray-100 text-gray-500' },
}

const MUNICIPIOS = ['Todas', 'Belém', 'Santarém', 'Marabá', 'Ananindeua', 'Castanhal']

export default function TurmasPage() {
  const [filtroMun, setFiltroMun] = useState('Todas')
  const [confirmarId, setConfirmarId] = useState<string | null>(null)
  const { data: equipes = [], isLoading } = useEquipes()
  const deletar = useDeleteEquipe()

  const filtradas = filtroMun === 'Todas'
    ? equipes
    : equipes.filter(e => e.escolas?.municipio === filtroMun)

  async function handleDelete() {
    if (!confirmarId) return
    await deletar.mutateAsync(confirmarId)
    setConfirmarId(null)
  }

  const emojis = ['🚀','⭐','🌙','🌟','🌠','💫','☄️','🛸','🌌','🪐']
  const emoji = (idx: number) => emojis[idx % emojis.length]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-navy-600">Equipes</h2>
        <span className="badge badge-navy">{filtradas.length}</span>
      </div>

      {/* Filtro municípios */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {MUNICIPIOS.map(m => (
          <button
            key={m}
            onClick={() => setFiltroMun(m)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              filtroMun === m
                ? 'bg-navy-600 text-white border-navy-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-navy-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Carregando equipes...</div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">Nenhuma equipe encontrada</div>
      ) : (
        <div className="space-y-2">
          {filtradas.map((eq, i) => {
            const st = STATUS_CONFIG[eq.status] ?? STATUS_CONFIG.incompleta
            return (
              <div key={eq.id} className="bg-white rounded-2xl border border-gray-200 px-3 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-600 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {emoji(i)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy-600 truncate">{eq.nome}</p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {eq.escolas?.nome} • {eq.escolas?.municipio}
                  </p>
                  <span className={`badge ${st.cls} mt-0.5`}>{st.label}</span>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setConfirmarId(eq.id)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Botão nova equipe */}
      <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 text-xs font-bold text-gray-400 hover:border-navy-400 hover:text-navy-600 hover:bg-white transition-all flex items-center justify-center gap-2">
        <Plus size={14} /> Adicionar Nova Equipe
      </button>

      {/* Estatísticas rápidas */}
      <div className="bg-navy-600 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-gold-400" />
          <p className="text-xs font-bold text-white">Resumo de Equipes</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { val: equipes.filter(e => e.status === 'completa').length,     lbl: 'Completas' },
            { val: equipes.filter(e => e.status === 'incompleta').length,   lbl: 'Incompletas' },
            { val: equipes.filter(e => e.status === 'classificada').length, lbl: 'Classificadas' },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="text-xl font-extrabold text-gold-400">{val}</div>
              <div className="text-[10px] text-white/60">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal confirmar exclusão */}
      {confirmarId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="text-sm font-extrabold text-navy-600 mb-1">Confirmar exclusão</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Tem certeza que deseja remover esta equipe? Todos os alunos vinculados serão desassociados.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmarId(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deletar.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600"
              >
                {deletar.isPending ? 'Removendo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
