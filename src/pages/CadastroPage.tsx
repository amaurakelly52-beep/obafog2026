import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, Download, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEscolas, useTurmas, useEquipes, useCriarAluno } from '@/hooks/useObafog'
import * as XLSX from 'xlsx'

interface FormData {
  nome: string
  data_nascimento: string
  escola_id: string
  turma_id: string
  equipe_id: string
  funcao: string
}

export default function CadastroPage() {
  const [tab, setTab] = useState<'individual' | 'lote'>('individual')
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; msg: string } | null>(null)
  const [importando, setImportando] = useState(false)

  const { data: escolas = [] } = useEscolas()
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  const escolaId = watch('escola_id')
  const { data: turmas = [] } = useTurmas(escolaId)
  const { data: equipes = [] } = useEquipes()
  const criarAluno = useCriarAluno()

  async function onSubmit(data: FormData) {
    try {
      await criarAluno.mutateAsync({
        nome: data.nome,
        data_nascimento: data.data_nascimento || null,
        escola_id: data.escola_id,
        turma_id: data.turma_id,
        equipe_id: data.equipe_id || null,
        funcao: (data.funcao as 'construtor') || null,
        cpf: null, email: null, telefone: null, ativo: true,
      })
      setFeedback({ tipo: 'success', msg: `Aluno "${data.nome.split(' ')[0]}" cadastrado com sucesso!` })
      reset()
      setTimeout(() => setFeedback(null), 4000)
    } catch {
      setFeedback({ tipo: 'error', msg: 'Erro ao cadastrar. Verifique os dados.' })
    }
  }

  function downloadModelo() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['nome', 'data_nascimento', 'cpf', 'email'],
      ['João Silva', '2007-03-12', '123.456.789-00', 'joao@email.com'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Alunos')
    XLSX.writeFile(wb, 'modelo_importacao_obafog.xlsx')
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportando(true)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf)
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      setFeedback({ tipo: 'success', msg: `${rows.length} registros lidos. Revise e confirme importação.` })
    } catch {
      setFeedback({ tipo: 'error', msg: 'Arquivo inválido. Use o modelo fornecido.' })
    }
    setImportando(false)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-extrabold text-navy-600">Cadastro de Alunos</h2>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['individual', 'lote'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t ? 'bg-white text-navy-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t === 'individual' ? '👤 Individual' : '📊 Importar em Lote'}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
          feedback.tipo === 'success' ? 'bg-green-50 border border-green-200 text-green-700'
                                     : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedback.tipo === 'success' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
          {feedback.msg}
        </div>
      )}

      {tab === 'individual' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-navy-600 border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <UserPlus size={13}/> Dados Pessoais
            </p>
            <div>
              <label className="form-label">Nome completo *</label>
              <input {...register('nome', { required: true })} className={`form-input ${errors.nome ? 'border-red-400' : ''}`} placeholder="Ex: João Pedro da Silva" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Data de nasc.</label>
                <input type="date" {...register('data_nascimento')} className="form-input" />
              </div>
              <div>
                <label className="form-label">Escola *</label>
                <select {...register('escola_id', { required: true })} className={`form-input ${errors.escola_id ? 'border-red-400' : ''}`}>
                  <option value="">Selecione...</option>
                  {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-navy-600 border-b border-gray-100 pb-2">🚀 Participação</p>
            <div>
              <label className="form-label">Turma *</label>
              <select {...register('turma_id', { required: true })} className={`form-input ${errors.turma_id ? 'border-red-400' : ''}`}>
                <option value="">Selecione a escola primeiro...</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Equipe</label>
              <select {...register('equipe_id')} className="form-input">
                <option value="">Sem equipe</option>
                {equipes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Função</label>
                <select {...register('funcao')} className="form-input">
                  <option value="">—</option>
                  <option value="construtor">Construtor</option>
                  <option value="lancador">Lançador</option>
                  <option value="observador">Observador</option>
                  <option value="anotador">Anotador</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Salvando...' : 'Salvar Aluno'}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-navy-600 border-b border-gray-100 pb-2">📥 Importar Planilha</p>
            <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-navy-400 hover:bg-gray-50 transition-all">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                {importando ? 'Processando...' : 'Arraste o arquivo Excel aqui'}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">.xlsx até 10MB • máx. 500 alunos</p>
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={downloadModelo} className="btn-gold flex items-center justify-center gap-2">
              <Download size={14} /> Baixar Modelo Excel
            </button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 space-y-1">
            <p className="font-bold">Instruções de importação:</p>
            <p>1. Baixe o modelo Excel acima</p>
            <p>2. Preencha os dados dos alunos na planilha</p>
            <p>3. Selecione o arquivo preenchido para importar</p>
            <p>4. Revise e confirme os dados antes de salvar</p>
          </div>
        </div>
      )}
    </div>
  )
}
