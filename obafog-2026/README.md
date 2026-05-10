# 🚀 OBAFOG 2026 — Sistema de Gestão da Olimpíada de Foguetes

Sistema web mobile-first para digitalizar e automatizar a gestão da Olimpíada de Foguetes do Estado do Pará, desenvolvido para coordenadores e professores da **SEDUC-PA**.

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🔐 Login | Autenticação via Supabase Auth com e-mail institucional |
| 📊 Dashboard | Métricas em tempo real: alunos, equipes, escolas, turmas |
| 👤 Cadastro | Formulário individual + importação em lote via Excel (.xlsx) |
| 👥 Turmas/Equipes | Criar, editar, filtrar por município, excluir com confirmação |
| 🏆 Ranking | Ranking ao vivo com pódio, barras de progresso e atualização automática |
| 📄 Relatórios | Geração de PDF e XLSX (relatório geral, ranking, por município, certificados) |

---

## 🛠 Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM v6
- **Formulários**: React Hook Form
- **Estado servidor**: TanStack Query (React Query)
- **Backend/DB**: Supabase (PostgreSQL + Auth + RLS)
- **Excel**: SheetJS (xlsx)
- **PDF**: jsPDF + jspdf-autotable
- **Ícones**: Lucide React

---

## 🚀 Início Rápido

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/obafog-2026.git
cd obafog-2026
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 4. Configurar o banco de dados Supabase

No painel do Supabase, abra o **SQL Editor** e execute os arquivos na ordem:

```
supabase/migrations/001_schema_inicial.sql
supabase/seed/001_dados_exemplo.sql     ← opcional (dados de demonstração)
```

### 5. Criar usuário de teste

No painel do Supabase → **Authentication → Users → Add user**:
- E-mail: `admin@seduc.pa.gov.br`
- Senha: `obafog2026`

Depois execute no SQL Editor:

```sql
INSERT INTO usuarios (id, email, nome, perfil)
VALUES (
  '<id-do-usuario-criado>',
  'admin@seduc.pa.gov.br',
  'Coordenador SEDUC',
  'admin'
);
```

### 6. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🗄 Estrutura do Banco de Dados

```
escolas          → Escolas participantes
  └─ turmas      → Turmas de cada escola
       └─ equipes → Equipes (até 4 alunos por equipe)
            └─ alunos    → Alunos vinculados
            └─ lancamentos → Lançamentos registrados

usuarios         → Professores e coordenadores (vinculados ao auth.users)
```

### Views
- `ranking_geral` — Classificação em tempo real por pontuação
- `estatisticas_gerais` — Contadores globais para o dashboard

### Functions
- `calcular_pontuacao_equipe(equipe_id)` — Recalcula e salva pontuação
- `importar_alunos_lote(alunos, escola_id, turma_id)` — Importação em lote

### Row Level Security
- **Admin/Coordenador**: acesso total a todos os dados
- **Professor**: acesso restrito à própria escola

---

## 📁 Estrutura de Pastas

```
obafog-2026/
├── src/
│   ├── components/
│   │   └── layout/         # Layout e navegação
│   ├── contexts/
│   │   └── AuthContext.tsx  # Autenticação global
│   ├── hooks/
│   │   └── useObafog.ts     # React Query hooks (CRUD)
│   ├── lib/
│   │   └── supabase.ts      # Client Supabase
│   ├── pages/               # Páginas da aplicação
│   └── types/
│       └── database.ts      # Tipos TypeScript gerados do schema
├── supabase/
│   ├── migrations/          # SQL do schema completo
│   └── seed/                # Dados de demonstração
├── .env.example
└── README.md
```

---

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos ficam em `dist/` prontos para deploy em Netlify, Vercel, etc.

### Deploy Vercel (recomendado)
```bash
npm i -g vercel
vercel --prod
```

Adicione as variáveis de ambiente na plataforma de deploy.

---

## 🏫 Sobre o Projeto

Sistema desenvolvido para a **Secretaria de Estado de Educação do Pará (SEDUC-PA)** para gestão da Olimpíada Brasileira de Foguetes (OBAFOG) 2026.

---

**SEDUC-PA © 2026 • Olimpíada de Foguetes do Pará**
