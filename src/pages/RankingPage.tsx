import { useState } from 'react'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useRanking } from '@/hooks/useObafog'

const CATEGORIAS = [
  { value: '', label: 'Geral' },
  { value: 'ensino_medio', label: 'Ensino Médio' },
  { value: 'fund_ii', label: 'Fund. II' },
]

const EMOJIS = ['🚀','⭐','🌙','🌟','🌠','💫','☄️','🛸','🌌','🪐']

export default function RankingPage() {
  const [categoria, setCategoria] = useState('')
  const { data: ranking = [], isLoading, refetch, isFetching } = useRanking(categoria || undefined)

  const top3 = ranking.slice(0, 3)
  const resto = ranking.slice(3)

  const maxScore = ranking[0]?.pontuacao_total ?? 1

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-navy-600 rounded-2xl p-4 text-center relative overflow-hidden">
        <div className="text-5xl opacity-10 absolute -right-2 -top-2 pointer-events-none">🚀</div>
        <h2 className="text-white font-extrabold text-base">🏆 Ranking Geral</h2>
        <p className="text-white/50 text-xs mt-0.5">Olimpíada de Foguetes Paraense 2026</p>
        <div className="inline-flex items-center gap-1.5 bg-gold-500 text-navy-600 text-[10px] font-extrabold px-3 py-1 rounded-full mt-2">
          <span className="w-1.5 h-1.5 bg-navy-600 rounded-full animate-pulse" />
          AO VIVO
        </div>
      </div>

      {/* Filtros + Refresh */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5 overflow-x-auto">
          {CATEGORIAS.map(c => (
            <button
              key={c.value}
              onClick={() => setCategoria(c.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                categoria === c.value
                  ? 'bg-navy-600 text-white border-navy-600'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => refetch()}
          className="w-8 h-8 flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-navy-600"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Carregando ranking...</div>
      ) : (
        <>
          {/* Pódio */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3">
              {/* 2º */}
              <div className="flex-1 text-center">
                <div className="h-14 bg-gray-200 rounded-t-lg flex items-center justify-center text-xl">🥈</div>
                <p className="text-[10px] font-bold text-navy-600 mt-1 leading-tight">{top3[1]?.equipe_nome}</p>
                <p className="text-[10px] text-gray-500">{top3[1]?.pontuacao_total.toFixed(1)} pts</p>
              </div>
              {/* 1º */}
              <div className="flex-1 text-center">
                <div className="h-20 bg-gold-400 rounded-t-lg flex items-center justify-center text-2xl">🥇</div>
                <p className="text-[10px] font-bold text-navy-600 mt-1 leading-tight">{top3[0]?.equipe_nome}</p>
                <p className="text-[10px] text-gray-500">{top3[0]?.pontuacao_total.toFixed(1)} pts</p>
              </div>
              {/* 3º */}
              <div className="flex-1 text-center">
                <div className="h-10 bg-orange-200 rounded-t-lg flex items-center justify-center text-lg">🥉</div>
                <p className="text-[10px] font-bold text-navy-600 mt-1 leading-tight">{top3[2]?.equipe_nome}</p>
                <p className="text-[10px] text-gray-500">{top3[2]?.pontuacao_total.toFixed(1)} pts</p>
              </div>
            </div>
          )}

          {/* Tabela completa */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {ranking.map((row, i) => (
              <div
                key={row.equipe_id}
                className={`flex items-center px-4 py-3 gap-3 border-b border-gray-100 last:border-0 ${
                  i === 0 ? 'bg-yellow-50' : ''
                }`}
              >
                <span className="text-xs font-extrabold text-navy-600 w-5 text-center flex-shrink-0">
                  {row.posicao}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                  {EMOJIS[i % EMOJIS.length]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-navy-600 truncate">{row.equipe_nome}</p>
                  <p className="text-[10px] text-gray-500 truncate">{row.escola_nome} • {row.municipio}</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gold-400 rounded-full"
                      style={{ width: `${(row.pontuacao_total / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-navy-600">
                    {row.pontuacao_total.toFixed(1)}
                  </p>
                  <div className="flex items-center justify-end gap-0.5 text-[10px] font-semibold text-green-600">
                    <TrendingUp size={10} />
                    pts
                  </div>
                </div>
              </div>
            ))}
            {ranking.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Nenhum resultado ainda
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
