# Task Manager - Better Auth & Next.js



Aplicação web full-stack para gerenciamento de tarefas pessoais com autenticação completa de usuários, controle de sessão e persistência em banco de dados relacional.



## Funcionalidades



### Autenticação e Controle de Acesso

- **Cadastro de Usuários (Sign Up):** Criação de conta com validação de dados no cliente via Zod e React Hook Form.

- **Autenticação (Login):** Login com e-mail e senha gerenciado pelo Better Auth, com redirecionamento automático para o painel principal.

- **Gerenciamento de Sessão e Rotas Protegidas:** Verificação de sessão ativa no servidor (Server Components) antes da renderização de páginas privadas, redirecionando usuários não autenticados.

- **Encerramento de Sessão (Logout):** Ação no servidor para invalidar a sessão atual e desconectar o usuário com segurança.



### Gerenciamento de Tarefas (CRUD)

- **Listagem Isolada por Usuário:** Exibição das tarefas vinculadas exclusivamente ao usuário autenticado, ordenadas por data de criação.

- **Criação de Tarefas:** Formulário com validação para adicionar novas tarefas contendo título obrigatório e descrição opcional.

- **Edição de Tarefas:** Modal interativo (Dialog) para atualizar título e descrição de tarefas existentes.

- **Alteração de Status:** Marcação e reabertura de tarefas (concluída / pendente) com atualização otimista de interface.

- **Exclusão de Tarefas:** Remoção permanente de tarefas mediante confirmação do usuário.

- **Feedback Visual:** Notificações em tempo real (toasts) para confirmação de ações e tratamento de erros.



## Tecnologias Utilizadas



- **Framework:** Next.js (App Router & Server Actions)

- **Runtime e Gerenciador de Pacotes:** Bun

- **Linguagem:** TypeScript

- **Autenticação:** Better Auth

- **ORM e Banco de Dados:** Prisma ORM + PostgreSQL (via Docker)

- **Estilização e Componentes UI:** Tailwind CSS + shadcn/ui + Lucide Icons

- **Validação e Formulários:** React Hook Form + Zod

- **Notificações:** Sonner



## Estrutura do Projeto



src/

├── app/

│   ├── (auth)/              # Rotas públicas de login e cadastro

│   ├── (private)/

│   │   └── dashboard/       # Painel principal protegido por sessão

│   ├── api/                 # Endpoints da API do Better Auth

│   └── layout.tsx           # Layout raiz e provedor de notificações

├── components/

│   ├── actions/

│   │   ├── auth/            # Server Actions de autenticação (logout)

│   │   └── tasks/           # Server Actions de CRUD de tarefas

│   ├── forms/               # Formulários (login, registro e tarefas)

│   ├── ui/                  # Componentes base do shadcn/ui

│   └── task-dashboard.tsx   # Interface interativa do painel de tarefas

├── generated/prisma/        # Cliente gerado pelo Prisma ORM

└── lib/                     # Configurações do Better Auth, Prisma e utilitários

prisma/

└── schema.prisma            # Modelagem das tabelas (User, Session, Account, Verification, Task)



## Pré-requisitos



- Bun instalado na máquina (https://bun.sh/)

- Docker para execução do container PostgreSQL (https://www.docker.com/)



## Como Executar o Projeto



### 1. Clonar o repositório e instalar as dependências



git clone https://github.com/seu-usuario/seu-repositorio.git

cd seu-repositorio

bun install



### 2. Configurar o banco de dados PostgreSQL no Docker



Suba um container PostgreSQL caso ainda não possua um em execução:



docker run --name postgres-task -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskmanager -p 5432:5432 -d postgres:15-alpine



### 3. Configurar as variáveis de ambiente



Crie um arquivo .env na raiz do projeto com as seguintes variáveis:



DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"

BETTER_AUTH_SECRET="sua_chave_secreta_aqui"

BETTER_AUTH_URL="http://localhost:3000"



### 4. Sincronizar o schema do banco de dados



Aplique as tabelas no PostgreSQL e gere o cliente do Prisma:



bunx prisma db push

bunx prisma generate



### 5. Iniciar o servidor de desenvolvimento



bun dev



Acesse http://localhost:3000 no navegador para utilizar a aplicação.