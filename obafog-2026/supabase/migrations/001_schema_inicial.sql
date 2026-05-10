-- ============================================================
-- OBAFOG 2026 — Olimpíada de Foguetes SEDUC-PA
-- Migration: 001_schema_inicial.sql
-- Execute no painel SQL do Supabase
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca textual

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE categoria_olimpiada AS ENUM ('ensino_medio', 'fund_ii');
CREATE TYPE status_equipe       AS ENUM ('incompleta', 'completa', 'classificada', 'eliminada');
CREATE TYPE fase_lancamento     AS ENUM ('classificatoria', 'semifinal', 'final');
CREATE TYPE funcao_aluno        AS ENUM ('construtor', 'lancador', 'observador', 'anotador');
CREATE TYPE perfil_usuario      AS ENUM ('admin', 'coordenador', 'professor');
CREATE TYPE turno_escola        AS ENUM ('matutino', 'vespertino', 'noturno');

-- ============================================================
-- TABELA: escolas
-- ============================================================
CREATE TABLE escolas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          TEXT NOT NULL,
  municipio     TEXT NOT NULL,
  codigo_inep   TEXT UNIQUE,
  endereco      TEXT,
  telefone      TEXT,
  email_diretor TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_escolas_municipio ON escolas (municipio);
CREATE INDEX idx_escolas_nome      ON escolas USING GIN (nome gin_trgm_ops);

-- ============================================================
-- TABELA: usuarios (vinculada ao auth.users do Supabase)
-- ============================================================
CREATE TABLE usuarios (
  id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email      TEXT NOT NULL UNIQUE,
  nome       TEXT NOT NULL,
  perfil     perfil_usuario NOT NULL DEFAULT 'professor',
  escola_id  UUID REFERENCES escolas (id) ON DELETE SET NULL,
  municipio  TEXT,
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_escola ON usuarios (escola_id);
CREATE INDEX idx_usuarios_perfil ON usuarios (perfil);

-- ============================================================
-- TABELA: turmas
-- ============================================================
CREATE TABLE turmas (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                  TEXT NOT NULL,
  escola_id             UUID NOT NULL REFERENCES escolas (id) ON DELETE CASCADE,
  ano_serie             TEXT NOT NULL,
  turno                 turno_escola NOT NULL DEFAULT 'matutino',
  professor_responsavel TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_turmas_escola ON turmas (escola_id);

-- ============================================================
-- TABELA: equipes
-- ============================================================
CREATE TABLE equipes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL,
  turma_id        UUID NOT NULL REFERENCES turmas (id) ON DELETE CASCADE,
  escola_id       UUID NOT NULL REFERENCES escolas (id) ON DELETE CASCADE,
  categoria       categoria_olimpiada NOT NULL DEFAULT 'ensino_medio',
  status          status_equipe NOT NULL DEFAULT 'incompleta',
  pontuacao_total NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipes_escola    ON equipes (escola_id);
CREATE INDEX idx_equipes_turma     ON equipes (turma_id);
CREATE INDEX idx_equipes_categoria ON equipes (categoria);
CREATE INDEX idx_equipes_status    ON equipes (status);

-- ============================================================
-- TABELA: alunos
-- ============================================================
CREATE TABLE alunos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome             TEXT NOT NULL,
  data_nascimento  DATE,
  cpf              TEXT UNIQUE,
  email            TEXT,
  telefone         TEXT,
  turma_id         UUID NOT NULL REFERENCES turmas (id) ON DELETE RESTRICT,
  equipe_id        UUID REFERENCES equipes (id) ON DELETE SET NULL,
  escola_id        UUID NOT NULL REFERENCES escolas (id) ON DELETE RESTRICT,
  funcao           funcao_aluno,
  ativo            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alunos_turma   ON alunos (turma_id);
CREATE INDEX idx_alunos_equipe  ON alunos (equipe_id);
CREATE INDEX idx_alunos_escola  ON alunos (escola_id);
CREATE INDEX idx_alunos_nome    ON alunos USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_alunos_ativo   ON alunos (ativo);

-- ============================================================
-- TABELA: lancamentos
-- ============================================================
CREATE TABLE lancamentos (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipe_id             UUID NOT NULL REFERENCES equipes (id) ON DELETE CASCADE,
  fase                  fase_lancamento NOT NULL DEFAULT 'classificatoria',
  numero_tentativa      SMALLINT NOT NULL DEFAULT 1 CHECK (numero_tentativa BETWEEN 1 AND 5),
  altura_metros         NUMERIC(7,2) CHECK (altura_metros >= 0),
  tempo_voo_segundos    NUMERIC(6,2) CHECK (tempo_voo_segundos >= 0),
  distancia_metros      NUMERIC(7,2) CHECK (distancia_metros >= 0),
  pontos                NUMERIC(8,2) NOT NULL DEFAULT 0,
  observacoes           TEXT,
  registrado_por        UUID REFERENCES usuarios (id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lancamentos_equipe ON lancamentos (equipe_id);
CREATE INDEX idx_lancamentos_fase   ON lancamentos (fase);

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_escolas_updated_at    BEFORE UPDATE ON escolas    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_usuarios_updated_at   BEFORE UPDATE ON usuarios   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_turmas_updated_at     BEFORE UPDATE ON turmas     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_equipes_updated_at    BEFORE UPDATE ON equipes    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_alunos_updated_at     BEFORE UPDATE ON alunos     FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- TRIGGER: atualizar status da equipe automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION atualizar_status_equipe()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_total INT;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM alunos
  WHERE equipe_id = COALESCE(NEW.equipe_id, OLD.equipe_id)
    AND ativo = TRUE;

  UPDATE equipes
  SET status = CASE
    WHEN v_total >= 4 THEN 'completa'
    ELSE 'incompleta'
  END
  WHERE id = COALESCE(NEW.equipe_id, OLD.equipe_id)
    AND status NOT IN ('classificada', 'eliminada');

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_alunos_status_equipe
AFTER INSERT OR UPDATE OF equipe_id OR DELETE ON alunos
FOR EACH ROW EXECUTE FUNCTION atualizar_status_equipe();

-- ============================================================
-- FUNCTION: calcular_pontuacao_equipe
-- ============================================================
CREATE OR REPLACE FUNCTION calcular_pontuacao_equipe(p_equipe_id UUID)
RETURNS NUMERIC LANGUAGE plpgsql AS $$
DECLARE
  v_pontuacao NUMERIC(8,2);
BEGIN
  SELECT COALESCE(SUM(pontos), 0)
  INTO v_pontuacao
  FROM lancamentos
  WHERE equipe_id = p_equipe_id;

  UPDATE equipes
  SET pontuacao_total = v_pontuacao
  WHERE id = p_equipe_id;

  RETURN v_pontuacao;
END;
$$;

-- Trigger para recalcular após cada lançamento
CREATE OR REPLACE FUNCTION trg_recalcular_pontuacao()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM calcular_pontuacao_equipe(COALESCE(NEW.equipe_id, OLD.equipe_id));
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lancamentos_pontuacao
AFTER INSERT OR UPDATE OR DELETE ON lancamentos
FOR EACH ROW EXECUTE FUNCTION trg_recalcular_pontuacao();

-- ============================================================
-- FUNCTION: importar_alunos_lote
-- ============================================================
CREATE OR REPLACE FUNCTION importar_alunos_lote(
  p_alunos    JSON,
  p_escola_id UUID,
  p_turma_id  UUID
)
RETURNS JSON LANGUAGE plpgsql AS $$
DECLARE
  v_aluno     JSON;
  v_inseridos INT := 0;
  v_erros     INT := 0;
BEGIN
  FOR v_aluno IN SELECT * FROM json_array_elements(p_alunos)
  LOOP
    BEGIN
      INSERT INTO alunos (nome, data_nascimento, cpf, email, escola_id, turma_id)
      VALUES (
        v_aluno->>'nome',
        (v_aluno->>'data_nascimento')::DATE,
        NULLIF(TRIM(v_aluno->>'cpf'), ''),
        NULLIF(TRIM(v_aluno->>'email'), ''),
        p_escola_id,
        p_turma_id
      )
      ON CONFLICT (cpf) DO NOTHING;

      v_inseridos := v_inseridos + 1;
    EXCEPTION WHEN OTHERS THEN
      v_erros := v_erros + 1;
    END;
  END LOOP;

  RETURN json_build_object('inseridos', v_inseridos, 'erros', v_erros);
END;
$$;

-- ============================================================
-- VIEW: ranking_geral
-- ============================================================
CREATE OR REPLACE VIEW ranking_geral AS
SELECT
  ROW_NUMBER() OVER (ORDER BY e.pontuacao_total DESC) AS posicao,
  e.id                AS equipe_id,
  e.nome              AS equipe_nome,
  es.nome             AS escola_nome,
  es.municipio,
  e.categoria::TEXT,
  e.pontuacao_total,
  COUNT(l.id)         AS num_lancamentos
FROM equipes e
JOIN escolas es ON es.id = e.escola_id
LEFT JOIN lancamentos l ON l.equipe_id = e.id
WHERE e.status != 'eliminada'
GROUP BY e.id, e.nome, e.pontuacao_total, e.categoria, es.nome, es.municipio
ORDER BY e.pontuacao_total DESC;

-- ============================================================
-- VIEW: estatisticas_gerais
-- ============================================================
CREATE OR REPLACE VIEW estatisticas_gerais AS
SELECT
  (SELECT COUNT(*) FROM alunos WHERE ativo = TRUE)              AS total_alunos,
  (SELECT COUNT(*) FROM equipes WHERE status != 'eliminada')     AS total_equipes,
  (SELECT COUNT(*) FROM escolas)                                 AS total_escolas,
  (SELECT COUNT(*) FROM turmas)                                  AS total_turmas,
  (SELECT COUNT(DISTINCT municipio) FROM escolas)               AS total_municipios,
  (SELECT COUNT(*) FROM equipes WHERE status = 'completa')       AS equipes_completas,
  (SELECT COUNT(*) FROM equipes WHERE status = 'classificada')   AS equipes_classificadas;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE escolas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios   ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;

-- Admins e coordenadores veem tudo
CREATE POLICY "admins_all" ON escolas    FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil IN ('admin','coordenador'))
);
CREATE POLICY "admins_all" ON turmas     FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil IN ('admin','coordenador'))
);
CREATE POLICY "admins_all" ON equipes    FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil IN ('admin','coordenador'))
);
CREATE POLICY "admins_all" ON alunos     FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil IN ('admin','coordenador'))
);
CREATE POLICY "admins_all" ON lancamentos FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil IN ('admin','coordenador'))
);

-- Professores veem apenas dados da própria escola
CREATE POLICY "professores_escola" ON turmas FOR ALL USING (
  escola_id = (SELECT escola_id FROM usuarios WHERE id = auth.uid())
);
CREATE POLICY "professores_escola" ON equipes FOR ALL USING (
  escola_id = (SELECT escola_id FROM usuarios WHERE id = auth.uid())
);
CREATE POLICY "professores_escola" ON alunos FOR ALL USING (
  escola_id = (SELECT escola_id FROM usuarios WHERE id = auth.uid())
);
CREATE POLICY "professores_escola" ON lancamentos FOR SELECT USING (
  equipe_id IN (
    SELECT id FROM equipes
    WHERE escola_id = (SELECT escola_id FROM usuarios WHERE id = auth.uid())
  )
);

-- Usuários gerenciam próprio perfil
CREATE POLICY "usuario_self" ON usuarios FOR ALL USING (id = auth.uid());
