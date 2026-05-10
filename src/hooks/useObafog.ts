import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Aluno, Equipe, Turma, Escola, RankingRow, EstatisticasGerais } from '@/types/database'

// ── Estatísticas gerais ──────────────────────────────────────
export function useEstatisticas() {
  return useQuery<EstatisticasGerais>({
    queryKey: ['estatisticas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estatisticas_gerais')
        .select('*')
        .single()
      if (error) throw error
      return data
    },
  })
}

// ── Escolas ──────────────────────────────────────────────────
export function useEscolas() {
  return useQuery<Escola[]>({
    queryKey: ['escolas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escolas')
        .select('*')
        .order('nome')
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Turmas ───────────────────────────────────────────────────
export function useTurmas(escolaId?: string) {
  return useQuery<Turma[]>({
    queryKey: ['turmas', escolaId],
    queryFn: async () => {
      let query = supabase.from('turmas').select('*').order('nome')
      if (escolaId) query = query.eq('escola_id', escolaId)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Equipes ──────────────────────────────────────────────────
export function useEquipes(filtros?: { municipio?: string; categoria?: string; status?: string }) {
  return useQuery<(Equipe & { escolas: { nome: string; municipio: string } })[]>({
    queryKey: ['equipes', filtros],
    queryFn: async () => {
      let query = supabase
        .from('equipes')
        .select('*, escolas(nome, municipio)')
        .order('nome')

      if (filtros?.categoria) query = query.eq('categoria', filtros.categoria)
      if (filtros?.status)    query = query.eq('status', filtros.status)

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useDeleteEquipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('equipes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['equipes'] })
      qc.invalidateQueries({ queryKey: ['estatisticas'] })
    },
  })
}

// ── Alunos ───────────────────────────────────────────────────
export function useAlunos(filtros?: { escolaId?: string; turmaId?: string; equipeId?: string }) {
  return useQuery<Aluno[]>({
    queryKey: ['alunos', filtros],
    queryFn: async () => {
      let query = supabase.from('alunos').select('*').eq('ativo', true).order('nome')
      if (filtros?.escolaId) query = query.eq('escola_id', filtros.escolaId)
      if (filtros?.turmaId)  query = query.eq('turma_id',  filtros.turmaId)
      if (filtros?.equipeId) query = query.eq('equipe_id', filtros.equipeId)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCriarAluno() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('alunos').insert(aluno).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alunos'] })
      qc.invalidateQueries({ queryKey: ['estatisticas'] })
      qc.invalidateQueries({ queryKey: ['equipes'] })
    },
  })
}

// ── Ranking ──────────────────────────────────────────────────
export function useRanking(categoria?: string) {
  return useQuery<RankingRow[]>({
    queryKey: ['ranking', categoria],
    queryFn: async () => {
      let query = supabase.from('ranking_geral').select('*')
      if (categoria) query = query.eq('categoria', categoria)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 30_000, // atualiza a cada 30s
  })
}
