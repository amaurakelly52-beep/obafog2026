-- ============================================================
-- OBAFOG 2026 — Dados de exemplo para desenvolvimento
-- Execute após 001_schema_inicial.sql
-- ============================================================

-- Escolas
INSERT INTO escolas (id, nome, municipio, codigo_inep, email_diretor) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'EEM Grão-Pará',                   'Belém',      '15000001', 'grao-para@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000002', 'EEM Magalhães Barata',             'Belém',      '15000002', 'magalhaes@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000003', 'CEEP Dom Bosco',                   'Marabá',     '15000003', 'dombosco@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000004', 'EEM Gov. Jarbas Passarinho',       'Santarém',   '15000004', 'jarbas@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000005', 'EEM Barão de Igarapé Miri',        'Igarapé Miri','15000005','barao@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000006', 'EEM Augusto Montenegro',           'Belém',      '15000006', 'augusto@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000007', 'EEEFM Padre Camilo Torquato',      'Castanhal',  '15000007', 'camilo@seduc.pa.gov.br'),
  ('a1000000-0000-0000-0000-000000000008', 'EEM Benedito Leite Monteiro',      'Ananindeua', '15000008', 'benedito@seduc.pa.gov.br');

-- Turmas
INSERT INTO turmas (id, nome, escola_id, ano_serie, turno, professor_responsavel) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Turma A - Manhã',  'a1000000-0000-0000-0000-000000000001', '2º Ano EM', 'matutino',   'Prof. Carlos Mendonça'),
  ('b1000000-0000-0000-0000-000000000002', 'Turma B - Tarde',  'a1000000-0000-0000-0000-000000000001', '3º Ano EM', 'vespertino', 'Prof. Maria Oliveira'),
  ('b1000000-0000-0000-0000-000000000003', 'Turma C - Manhã',  'a1000000-0000-0000-0000-000000000002', '2º Ano EM', 'matutino',   'Prof. João Figueiredo'),
  ('b1000000-0000-0000-0000-000000000004', 'Turma D - Tarde',  'a1000000-0000-0000-0000-000000000003', '1º Ano EM', 'vespertino', 'Prof. Ana Rodrigues'),
  ('b1000000-0000-0000-0000-000000000005', 'Turma E - Manhã',  'a1000000-0000-0000-0000-000000000004', '3º Ano EM', 'matutino',   'Prof. Paulo Barbosa'),
  ('b1000000-0000-0000-0000-000000000006', 'Turma F - Manhã',  'a1000000-0000-0000-0000-000000000005', '2º Ano EM', 'matutino',   'Prof. Lucia Ferreira');

-- Equipes
INSERT INTO equipes (id, nome, turma_id, escola_id, categoria, status, pontuacao_total) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Equipe Saturno', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'ensino_medio', 'classificada', 98.70),
  ('c1000000-0000-0000-0000-000000000002', 'Equipe Orion',   'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'ensino_medio', 'completa',     94.20),
  ('c1000000-0000-0000-0000-000000000003', 'Equipe Apolo',   'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'ensino_medio', 'completa',     91.50),
  ('c1000000-0000-0000-0000-000000000004', 'Equipe Perseu',  'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000004', 'ensino_medio', 'classificada', 87.90),
  ('c1000000-0000-0000-0000-000000000005', 'Equipe Vega',    'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005', 'ensino_medio', 'completa',     84.10),
  ('c1000000-0000-0000-0000-000000000006', 'Equipe Sirius',  'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'ensino_medio', 'incompleta',    0.00);

-- Alunos (4 por equipe completa)
INSERT INTO alunos (nome, escola_id, turma_id, equipe_id, funcao, data_nascimento) VALUES
  -- Equipe Saturno
  ('Pedro Alves Moraes',      'a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','construtor', '2007-03-12'),
  ('Letícia Sousa Lima',      'a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','lancador',   '2007-07-22'),
  ('Marcos Vinicius Santos',  'a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','observador', '2008-01-05'),
  ('Beatriz Costa Nunes',     'a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','anotador',   '2007-11-30'),
  -- Equipe Orion
  ('Rafael Gomes Pereira',    'a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000002','construtor', '2008-04-18'),
  ('Isabela Matos Ferreira',  'a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000002','lancador',   '2007-09-14'),
  ('Gabriel Rocha Oliveira',  'a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000002','observador', '2007-06-02'),
  ('Sophia Barros Carvalho',  'a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000002','anotador',   '2008-02-27'),
  -- Equipe Apolo
  ('Lucas Ribeiro Mendes',    'a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000003','construtor', '2007-12-08'),
  ('Ana Claudia Pimentel',    'a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000003','lancador',   '2008-05-19'),
  ('Thiago Nascimento Cruz',  'a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000003','observador', '2007-08-03'),
  ('Camila Lopes Andrade',    'a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000003','anotador',   '2007-10-21');

-- Lançamentos
INSERT INTO lancamentos (equipe_id, fase, numero_tentativa, altura_metros, tempo_voo_segundos, pontos) VALUES
  ('c1000000-0000-0000-0000-000000000001','classificatoria', 1, 48.5, 12.3, 49.10),
  ('c1000000-0000-0000-0000-000000000001','classificatoria', 2, 51.2, 13.1, 49.60),
  ('c1000000-0000-0000-0000-000000000002','classificatoria', 1, 46.8, 11.9, 47.20),
  ('c1000000-0000-0000-0000-000000000002','classificatoria', 2, 47.0, 12.0, 47.00),
  ('c1000000-0000-0000-0000-000000000003','classificatoria', 1, 44.3, 11.5, 45.50),
  ('c1000000-0000-0000-0000-000000000003','classificatoria', 2, 46.0, 11.8, 46.00),
  ('c1000000-0000-0000-0000-000000000004','classificatoria', 1, 42.1, 11.2, 43.70),
  ('c1000000-0000-0000-0000-000000000004','classificatoria', 2, 44.2, 11.6, 44.20),
  ('c1000000-0000-0000-0000-000000000005','classificatoria', 1, 40.5, 10.9, 42.10),
  ('c1000000-0000-0000-0000-000000000005','classificatoria', 2, 42.0, 11.1, 42.00);
