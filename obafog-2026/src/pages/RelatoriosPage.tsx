import { useState } from 'react'
import { FileText, Download, Table, Trophy, MapPin, Award, ChevronRight } from 'lucide-react'
import { useEstatisticas } from '@/hooks/useObafog'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Relatorio = {
  id: string
  icon: React.ReactNode
  nome: string
  desc: string
  tipo: 'PDF' | 'XLSX'
  tamanho: string
  cor: string
}

const RELATORIOS: Relatorio[] = [
  { id: 'geral',        icon: <FileText size={18}/>,  nome: 'Relatório Geral',        desc: 'Todos alunos, equipes e resultados',  tipo: 'PDF',  tamanho: '~2.4 MB', cor: 'bg-navy-600 text-white' },
  { id: 'participantes',icon: <Table size={18}/>,      nome: 'Lista de Participantes', desc: 'Exportar cadastros completos',         tipo: 'XLSX', tamanho: '~850 KB', cor: 'bg-yellow-50 text-navy-600' },
  { id: 'ranking',      icon: <Trophy size={18}/>,     nome: 'Ranking Oficial',        desc: 'Classificação para publicação',        tipo: 'PDF',  tamanho: '~1.1 MB', cor: 'bg-navy-600 text-white' },
  { id: 'municipio',    icon: <MapPin size={18}/>,     nome: 'Por Município',          desc: 'Consolidado regional',                tipo: 'PDF',  tamanho: '~980 KB', cor: 'bg-green-50 text-green-700' },
  { id: 'certificados', icon: <Award size={18}/>,      nome: 'Certificados',           desc: 'Geração em lote para alunos',         tipo: 'PDF',  tamanho: '~12 MB',  cor: 'bg-blue-50 text-blue-700' },
]

export default function RelatoriosPage() {
  const { data: stats } = useEstatisticas()
  const [gerando, setGerando] = useState<string | null>(null)

  async function gerarRelatorio(id: string) {
    setGerando(id)
    await new Promise(r => setTimeout(r, 1200))

    if (id === 'geral' || id === 'ranking' || id === 'municipio' || id === 'certificados') {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.setTextColor(11, 36, 71)
      doc.text('OBAFOG 2026 — SEDUC-PA', 14, 20)
      doc.setFontSize(11)
      doc.text('Olimpíada de Foguetes do Estado do Pará', 14, 28)
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 35)

      autoTable(doc, {
        startY: 45,
        head: [['Indicador', 'Valor']],
        body: [
          ['Total de Alunos',       String(stats?.total_alunos ?? 0)],
          ['Total de Equipes',      String(stats?.total_equipes ?? 0)],
          ['Total de Escolas',      String(stats?.total_escolas ?? 0)],
          ['Municípios Participantes', String(stats?.total_municipios ?? 0)],
          ['Equipes Completas',     String(stats?.equipes_completas ?? 0)],
          ['Equipes Classificadas', String(stats?.equipes_classificadas ?? 0)],
        ],
        headStyles: { fillColor: [11, 36, 71] },
      })

      doc.save(`obafog_2026_${id}_${Date.now()}.pdf`)
    }

    setGerando(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-extrabold text-navy-600">Relatórios</h2>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { val: stats?.total_alunos ?? 0,   lbl: 'Alunos' },
          { val: stats?.total_equipes ?? 0,  lbl: 'Equipes' },
          { val: stats?.total_escolas ?? 0,  lbl: 'Escolas' },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-xl font-extrabold text-navy-600">{val}</div>
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Lista de relatórios */}
      <div className="space-y-2">
        {RELATORIOS.map(r => (
          <button
            key={r.id}
            onClick={() => gerarRelatorio(r.id)}
            disabled={gerando === r.id}
            className="w-full bg-white rounded-2xl border border-gray-200 px-3 py-3 flex items-center gap-3 text-left hover:border-navy-300 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <div className={`w-10 h-10 rounded-xl ${r.cor} flex items-center justify-center flex-shrink-0`}>
              {gerando === r.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : r.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy-600">{r.nome}</p>
              <p className="text-[10px] text-gray-500">{r.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`badge ${r.tipo === 'PDF' ? 'badge-info' : 'badge-success'}`}>
                {r.tipo}
              </span>
              <span className="text-[10px] text-gray-400">{r.tamanho}</span>
            </div>
            <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>

      <button
        onClick={() => RELATORIOS.forEach(r => setTimeout(() => gerarRelatorio(r.id), 300))}
        className="btn-primary flex items-center justify-center gap-2"
      >
        <Download size={14} /> Gerar Todos os Relatórios
      </button>

      <p className="text-[10px] text-gray-400 text-center">
        Relatórios gerados localmente • Dados atualizados em tempo real
      </p>
    </div>
  )
}
