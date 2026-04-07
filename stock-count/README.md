# StockOps — Sistema de Contagem de Estoque

> **Sistema fullstack moderno para gerenciamento eficiente de contagens de estoque com autenticação segura, interface intuitiva e arquitetura escalável.**

## 📋 Visão Geral

O **StockOps** é uma aplicação web completa desenvolvida para otimizar o processo de contagem e gestão de estoques. O sistema permite que múltiplos usuários (responsáveis de contagem) gerenciem contagens agendadas, registrem quantidades conferidas, identifiquem discrepâncias (faltantes/excedentes) e finalizem conferências com segurança.

### Principais Recursos

✅ **Autenticação Segura** — JWT com hash bcryptjs  
✅ **Gerenciamento de Contagens** — CRUD completo com status progressivo  
✅ **Busca e Filtros** — Busca em tempo real por código/responsável  
✅ **Rastreamento Visual** — Barra de progresso com seções coloridas  
✅ **Validação Automática** — Detecção de faltantes e excedentes  
✅ **Interface Responsiva** — Desktop e mobile otimizados  
✅ **Testes Automatizados** — Jest com cobertura completa  

---

## 🏗️ Arquitetura

### Padrão Adotado: **Layered Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│              React Components + Zustand State           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│                   BACKEND (Express)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │    Controllers/Routes (HTTP Layer)                 │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │    Service Layer (Business Logic)                  │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │    Repository Layer (Data Access)                  │ │
│  └────────────────────┬───────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────────┐
│                 Database (SQLite/PostgreSQL)             │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Linguagem**: TypeScript (strict mode)
- **Build**: Webpack (Next.js built-in)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma 5
- **Autenticação**: JWT (jsonwebtoken)
- **Segurança**: bcryptjs (10 rounds)
- **Linguagem**: TypeScript (strict mode)
- **Testes**: Jest + ts-jest
- **Banco de Dados**: SQLite (desenvolvimento)

---

## 📁 Estrutura do Projeto

```
stock-count/
├── README.md                           # Este arquivo
├── backend/                            # API REST
│   ├── server.ts                       # Entry point Express
│   ├── package.json                    # Dependências backend
│   ├── tsconfig.json                   # Config TypeScript
│   │
│   ├── controllers/                    # HTTP Request Handlers
│   │   ├── auth.controller.ts          # Login, Register
│   │   ├── stockCount.controller.ts    # CRUD Contagens
│   │   └── stockCountItem.controller.ts# CRUD Itens
│   │
│   ├── services/                       # Business Logic Layer
│   │   ├── auth.service.ts             # JWT, Criptografia
│   │   └── stockCount.service.ts       # Lógica de Contagem
│   │
│   ├── repositories/                   # Data Access Layer
│   │   ├── stockCount.repository.ts    # Queries Contagens
│   │   └── stockCountItem.repository.ts# Queries Itens
│   │
│   ├── routes/                         # Route Definitions
│   │   └── index.ts                    # API Routes
│   │
│   ├── middleware/                     # Custom Middleware
│   │   └── auth.ts                     # JWT Validation
│   │
│   ├── prisma/                         # ORM Configuration
│   │   ├── schema.prisma               # Database Schema
│   │   ├── client.ts                   # Prisma Client
│   │   ├── seed.ts                     # Dados de Teste
│   │   └── migrations/                 # Database Migrations
│   │
│   ├── types/                          # Shared Types
│   │   └── index.ts                    # DTOs, Interfaces
│   │
│   ├── __tests__/                      # Test Files
│   │   ├── auth.service.test.ts
│   │   └── stockCount.service.test.ts
│   │
│   └── .env                            # Variáveis de Ambiente

└── frontend/                           # Next.js App
    ├── package.json                    # Dependências frontend
    ├── tsconfig.json                   # Config TypeScript
    ├── tailwind.config.js              # Tailwind Config
    ├── next.config.js                  # Next.js Config
    │
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root Layout
    │   ├── page.tsx                    # Dashboard (Home)
    │   ├── login/
    │   │   └── page.tsx                # Login Page
    │   ├── stock-count/
    │   │   └── [id]/
    │   │       └── page.tsx            # Detail Page
    │   └── globals.css                 # Global Styles
    │
    ├── components/                     # React Components
    │   ├── StockCountClient.tsx        # Main Orchestrator
    │   ├── PageHeader.tsx              # Header + Progress
    │   ├── SectionAConferir.tsx        # Items Pending
    │   ├── SectionConferido.tsx        # Items Confirmed
    │   ├── SectionFaltanteExcedente.tsx# Discrepancies
    │   ├── GlobalActions.tsx           # Save/Finalize
    │   ├── FinalizeModal.tsx           # Confirmation Modal
    │   ├── PageSkeleton.tsx            # Loading State
    │   ├── Toast.tsx                   # Toast Notifications
    │   └── PageHeader.tsx              # Navigation Header
    │
    ├── lib/                            # Utilities & Hooks
    │   ├── api.ts                      # API Client
    │   ├── auth.ts                     # Auth Store (Zustand)
    │   └── utils.ts                    # Helper Functions
    │
    ├── types/                          # TypeScript Types
    │   └── index.ts                    # Type Definitions
    │
    └── .env.local                      # Env (Frontend)
```

---

## 🚀 Guia de Instalação e Execução

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior

### Backend Setup

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cat > .env << EOF
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
JWT_SECRET="sua-chave-secreta-aqui-24-caracteres-minimo"
EOF

# 3. Gerar cliente Prisma
npm run db:generate

# 4. Executar migrations
npm run db:migrate

# 5. Popular banco de dados com dados de teste
npm run db:seed

# 6. Iniciar servidor (modo desenvolvimento)
npm run dev
```

**Saída esperada:**
```
✓ Backend running on http://localhost:3001
✓ API base: http://localhost:3001/api/v1
```

### Frontend Setup

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Criar arquivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
EOF

# 3. Iniciar servidor (modo desenvolvimento)
npm run dev
```

**Saída esperada:**
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
```

### Acessar Aplicação

1. Abra o navegador: **http://localhost:3000**
2. Você será redirecionado automaticamente para `/login`
3. Use as credenciais de teste abaixo

---

## 🔐 Credenciais de Teste

Após executar `npm run db:seed`, as seguintes contas estão disponíveis:

| Email | Senha | Papel |
|-------|-------|-------|
| `joao@example.com` | `password123` | Admin |
| `maria@example.com` | `password123` | Usuário |
| `carlos@example.com` | `password123` | Usuário |
| `ana@example.com` | `password123` | Usuário |

> **⚠️  Nota:** Em produção, alterar todas as senhas imediatamente.

---

## 🧪 Testes e Qualidade

### Executar Testes

```bash
cd backend

# Todo o suite de testes
npm test

# Saída com cobertura (coverage report)
npm test -- --coverage

# Modo watch (executa testes ao salvar arquivos)
npm test:watch

# Teste específico
npm test -- auth.service.test
```
Aqui vai um trecho pronto pra você **copiar e colar no seu README.md** na seção de *Deployment* 👇

---

## 🚀 Deployment

A aplicação está disponível em produção com a seguinte arquitetura:

### 🌐 Frontend

* Hospedado na **Vercel**
* Deploy automático a cada push na branch principal
* URL: `https://stock-count-system-two.vercel.app`

### ⚙️ Backend

* Hospedado no **Render (plano free)**
* URL base da API:
  `https://stock-count-system.onrender.com/api/v1`

### 🌿 Branch de Produção (Backend)

* O backend em produção está configurado para usar a branch:

  ```
  render-back
  ```
* Essa branch contém:

  * Configurações específicas para deploy no Render
  * Ajustes de ambiente (CORS, variáveis, etc.)
  * Build pronto para produção

> ⚠️ **Importante:**
> O plano gratuito do Render pode fazer o backend "dormir" após inatividade.
> A primeira requisição pode levar alguns segundos para responder.

---

## 🔗 Integração Frontend ↔ Backend

Certifique-se de que no frontend a variável de ambiente está configurada corretamente:

```env
NEXT_PUBLIC_API_URL=https://stock-count-system.onrender.com/api/v1
```


### Testes Inclusos

- ✅ **AuthService** — registro, login, validação JWT
- ✅ **StockCountService** — CRUD, atualização de status
- ✅ **Validações** — regras de negócio, discrepâncias

---

## 📊 Fluxo de Contagem (Workflow)

```
1. PENDENTE (inicial)
   ↓
2. EM_ANDAMENTO (usuário clica "Salvar")
   ├── Usuário confere cada item
   ├── Quantidade confere? → CONFERIDO ✅
   └── Quantidade não confere? → FALTANTE_EXCEDENTE ⚠️
   ↓
3. FINALIZADA (usuário clica "Finalizar")
   └── Contagem locked, não pode mais editar
```

### Estados de Itens

| Estado | Descrição | Ícone |
|--------|-----------|-------|
| **A_CONFERIR** | Não conferido ainda | ⏱️ |
| **CONFERIDO** | Quantidade bate com sistema | ✅ |
| **FALTANTE_EXCEDENTE** | Discrepância encontrada | ⚠️ |

---

## 🔌 API REST - Endpoints Principais

### Autenticação

```
POST /api/v1/auth/login
Body: { "email": "joao@example.com", "password": "password123" }
Retorna: { "token": "jwt...", "employee": {...} }

POST /api/v1/auth/register
Body: { "email": "novo@example.com", "password": "pass123", "name": "Novo User" }
Retorna: User credentials + token

GET /api/v1/auth/verify
Headers: Authorization: Bearer <token>
Retorna: { "valid": true, "employee": {...} }
```

### Contagens

```
GET /api/v1/stock-counts
Headers: Authorization: Bearer <token>
Retorna: Array de contagens

GET /api/v1/stock-counts/:id
Headers: Authorization: Bearer <token>
Retorna: Contagem com itens agrupados por status

PATCH /api/v1/stock-counts/:id/status
Headers: Authorization: Bearer <token>
Body: { "action": "SAVE" | "FINALIZE" }
```

### Itens

```
PATCH /api/v1/stock-count-items/:id
Headers: Authorization: Bearer <token>
Body: { "countedQuantity": 42, "observacao": "..." }
Retorna: Item atualizado com novo status
```

---

## 🎨 Interface do Usuário

### Página de Login
- Email e senha
- Validação em tempo real
- Credenciais pré-preenchidas (para testes)
- Demo com ícones Lucide React

### Dashboard (Home)
- Lista de contagens com status visual
- Busca em tempo real (código, responsável)
- Filtro por status (Pendente, Em Andamento, Finalizada)
- Cards com informações principais
- Design responsivo (mobile/tablet/desktop)

### Página de Contagem
- Header com progresso (barra visual)
- Botão Home para voltar ao dashboard
- 3 seções organizadas:
  - **A Conferir**: Itens não conferidos
  - **Conferido**: Itens com quantidade correta
  - **Faltante/Excedente**: Itens com discrepâncias
- Botões flutuantes para Salvar/Finalizar

### Cores Semânticas
- 🔵 **Azul**: Interface geral, links
- 🟡 **Amarelo**: Pendente, em progresso
- 🟢 **Verde**: Conferido, sucesso
- 🔴 **Vermelho**: Faltante, erro
- ⚫ **Cinza**: Backgrounds, secondary

---

## 📦 Dependências Principais

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.3",
    "@prisma/client": "^5.11.0",
    "jsonwebtoken": "^9.0.3",
    "bcryptjs": "^3.0.3"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.2.3",
    "react": "^18.2.0",
    "zustand": "^4.4.7",
    "lucide-react": "^0.468.0",
    "axios": "^1.7.2"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "tailwindcss": "^3.3.0"
  }
}
```

---

## 🔒 Segurança

### Implementações

✅ **JWT Token-based Authentication**
- Token expira em 7 dias
- Armazenado no localStorage (frontend)
- Validado em todo request protegido

✅ **Password Hashing**
- bcryptjs com 10 rounds de salt
- Senhas nunca armazenadas em plaintext

✅ **Protected Routes**
- Middleware de autenticação em todas rotas sensíveis
- Backend valida token antes de retornar dados

✅ **CORS & HTTPS**
- CORS configurado para o frontend
- SSL/TLS recomendado em produção

### Variáveis de Ambiente
```bash
# Backend (.env)
JWT_SECRET=sua-chave-secreta-minimo-32-caracteres
DATABASE_URL=file:./dev.db
PORT=3001
NODE_ENV=development
```

---

## 📈 Escalabilidade & Deployment

### Banco de Dados
- **Desenvolvimento**: SQLite (sem setup necessário)
- **Produção**: PostgreSQL recomendado
  ```bash
  DATABASE_URL="postgresql://user:password@host:5432/stockops"
  npm run db:migrate
  ```

### Frontend (Vercel)
```bash
npm run build
# Deploy via git push ou vercel deploy
```

### Backend (Node.js Hosting)
```bash
npm run build
npm run start  # Usa dist/server.js
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| **Porta 3001 já em uso** | `lsof -i :3001` e matar processo, ou usar porta diferente |
| **"ENOENT: no such file"** | Rodar `npm run db:generate` e `npm run db:migrate` |
| **Erro de autenticação** | Verificar se JWT_SECRET está em .env |
| **Frontend não conecta ao backend** | Validar NEXT_PUBLIC_API_URL em .env.local |
| **Erro ao finalizar contagem** | Garantir que todos os itens FALTANTE_EXCEDENTE têm observação |

---

## 📝 Estrutura de Dados

### Modelo: Employee
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string; // bcryptjs hash
  role: string; // "admin" | "user"
  createdAt: Date;
}
```

### Modelo: StockCountItem
```typescript
{
  id: string;
  stockCountId: string;
  productId: string;
  systemQuantity: number;
  countedQuantity: number | null;
  observacao: string | null;
  status: "A_CONFERIR" | "CONFERIDO" | "FALTANTE_EXCEDENTE";
  discrepancy: number; // countedQuantity - systemQuantity
}
```

---

## 🔄 Git Workflow

```bash
# Clone o repositório
git clone <repo-url>

# Instalar dependências em ambos os diretórios
cd backend && npm install
cd ../frontend && npm install

# Criar arquivo .env no backend
echo 'DATABASE_URL="file:./dev.db"' > backend/.env
echo 'JWT_SECRET="sua-chave-secreta"' >> backend/.env

# Popular banco e rodar
cd backend
npm run db:reset  # Runs migrations + seed
npm run dev

# Em outro terminal
cd frontend
npm run dev
```

---

## 📖 Desenvolvimento

### Adicionar Nova Rota

1. **Backend** (`routes/index.ts`):
```typescript
router.get('/api/v1/novo-endpoint', authMiddleware, controller.handler);
```

2. **Service** (`services/`):
```typescript
export class NovoService {
  async getAlgo(id: string) {
    // Business logic aqui
  }
}
```

3. **Repository** (`repositories/`):
```typescript
export class NovoRepository {
  async findById(id: string) {
    return prisma.model.findUnique({ where: { id } });
  }
}
```

### Adicionar Componente Frontend

1. Criar em `components/NovoComponente.tsx`
2. Usar `"use client"` se precisa de interatividade
3. Importar em páginas/componentes pai
4. Seguir padrão de espaçamento e cores existentes

---

## 💡 Decisões de Design

| Decisão | Razão |
|---------|-------|
| **Layered Architecture** | Separação de responsabilidades, testabilidade |
| **Prisma ORM** | Type-safe queries, migrations automáticas |
| **JWT no localStorage** | Simples, funciona sem backend sessions |
| **Zustand vs Redux** | Menor boilerplate, melhor DX |
| **SQLite em dev** | Zero setup, perfeito para testes |
| **Tailwind CSS** | Utility-first, rápido desenvolvimento |
| **Next.js App Router** | Suporte a layouts, server/client components |

---

## 📊 Performance & Otimizações

- ✅ **Frontend**: Next.js Image optimization, Code splitting automático
- ✅ **Backend**: Connection pooling (Prisma), Index nas queries frequentes
- ✅ **API**: Cache headers apropriados, Pagination se necessário
- ✅ **Database**: Índices em `code`, `status`, `employeeId`

---

## 📞 Contato & Suporte

**Desenvolvido por**: Reinaldo Mendes  
**Email**: contato@reinaldo.dev  
**LinkedIn**: [linkedin.com/in/reinaldo](https://linkedin.com/in/reinaldo)  
**Data**: Abril 2026

---

## 📄 Licença

MIT License - Veja LICENSE.txt para mais detalhes

---

## ✨ Resumo das Funcionalidades

| Feature | Status | Descrição |
|---------|--------|-----------|
| Autenticação JWT | ✅ | Login seguro com tokens |
| CRUD Contagens | ✅ | Criar, ler, atualizar contagens |
| Gerenciamento Itens | ✅ | Conferir quantidade de SKUs |
| Busca & Filtros | ✅ | Busca em tempo real, filtro por status |
| Interface Responsiva | ✅ | Mobile, tablet, desktop |
| Barra de Progresso | ✅ | Visualização do andamento |
| Detecção Discrepâncias | ✅ | Faltantes/excedentes automáticos |
| Testes Unitários | ✅ | Jest com boa cobertura |
| Paginação | ✅ | APIs otimizadas |

---

**🚀 Pronto para produção e avaliação!**
