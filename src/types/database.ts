export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      escolas: {
        Row: {
          id: string
          nome: string
          municipio: string
          codigo_inep: string | null
          endereco: string | null
          telefone: string | null
          email_diretor: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['escolas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['escolas']['Insert']>
      }
      turmas: {
        Row: {
          id: string
          nome: string
          escola_id: string
          ano_serie: string
          turno: 'matutino' | 'vespertino' | 'noturno'
          professor_responsavel: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['turmas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['turmas']['Insert']>
      }
      equipes: {
        Row: {
          id: string
          nome: string
          turma_id: string
          escola_id: string
          categoria: 'ensino_medio' | 'fund_ii'
          status: 'incompleta' | 'completa' | 'classificada' | 'eliminada'
          pontuacao_total: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['equipes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['equipes']['Insert']>
      }
      alunos: {
        Row: {
          id: string
          nome: string
          data_nascimento: string | null
          cpf: string | null
          email: string | null
          telefone: string | null
          turma_id: string
          equipe_id: string | null
          escola_id: string
          funcao: 'construtor' | 'lancador' | 'observador' | 'anotador' | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['alunos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['alunos']['Insert']>
      }
      lancamentos: {
        Row: {
          id: string
          equipe_id: string
          fase: 'classificatoria' | 'semifinal' | 'final'
          numero_tentativa: number
          altura_metros: number | null
          tempo_voo_segundos: number | null
          distancia_metros: number | null
          pontos: number
          observacoes: string | null
          registrado_por: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['lancamentos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['lancamentos']['Insert']>
      }
      usuarios: {
        Row: {
          id: string
          email: string
          nome: string
          perfil: 'coordenador' | 'professor' | 'admin'
          escola_id: string | null
          municipio: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }
    }
    Views: {
      ranking_geral: {
        Row: {
          posicao: number
          equipe_id: string
          equipe_nome: string
          escola_nome: string
          municipio: string
          categoria: string
          pontuacao_total: number
          num_lancamentos: number
        }
      }
      estatisticas_gerais: {
        Row: {
          total_alunos: number
          total_equipes: number
          total_escolas: number
          total_turmas: number
          total_municipios: number
          equipes_completas: number
          equipes_classificadas: number
        }
      }
    }
    Functions: {
      calcular_pontuacao_equipe: {
        Args: { p_equipe_id: string }
        Returns: number
      }
      importar_alunos_lote: {
        Args: { p_alunos: Json; p_escola_id: string; p_turma_id: string }
        Returns: { inseridos: number; erros: number }
      }
    }
    Enums: {
      categoria_olimpiada: 'ensino_medio' | 'fund_ii'
      status_equipe: 'incompleta' | 'completa' | 'classificada' | 'eliminada'
      fase_lancamento: 'classificatoria' | 'semifinal' | 'final'
      funcao_aluno: 'construtor' | 'lancador' | 'observador' | 'anotador'
      perfil_usuario: 'coordenador' | 'professor' | 'admin'
      turno: 'matutino' | 'vespertino' | 'noturno'
    }
  }
}

// Aliases para facilitar uso nos componentes
export type Escola    = Database['public']['Tables']['escolas']['Row']
export type Turma     = Database['public']['Tables']['turmas']['Row']
export type Equipe    = Database['public']['Tables']['equipes']['Row']
export type Aluno     = Database['public']['Tables']['alunos']['Row']
export type Lancamento = Database['public']['Tables']['lancamentos']['Row']
export type Usuario   = Database['public']['Tables']['usuarios']['Row']
export type RankingRow = Database['public']['Views']['ranking_geral']['Row']
export type EstatisticasGerais = Database['public']['Views']['estatisticas_gerais']['Row']
