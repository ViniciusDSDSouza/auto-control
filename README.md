# Auto Control

Sistema completo de gestão para oficinas mecânicas, desenvolvido para facilitar o controle de clientes, carros, peças e notas de serviço.

![Visão Geral](./docs/screenshots/listagem-de-notas.png)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação com Docker](#instalação-com-docker-recomendado)
  - [Instalação Manual](#instalação-manual)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Telas do Sistema](#-telas-do-sistema)

## 📖 Visão Geral

O **Auto Control** é uma aplicação web full-stack desenvolvida para gerenciar oficinas mecânicas. O sistema permite:

- **Gestão de Clientes**: Cadastro e consulta de clientes com informações de contato
- **Gestão de Veículos**: Cadastro de carros vinculados aos clientes, incluindo marca, modelo, placa, ano e cor
- **Gestão de Peças**: Controle de inventário de peças com preços
- **Gestão de Notas de Serviço**: Criação e gerenciamento de notas fiscais com:
  - Vínculo a cliente e veículo
  - Adição de peças com quantidades
  - Cálculo automático de valores (peças, mão de obra e total)
  - Status das notas (ABERTA, PAGA, CANCELADA)

### Estrutura do Projeto

```
auto-control/
├── backend/          # API REST em Node.js/Express
├── frontend/         # Aplicação Next.js
├── docs/            # Documentação e screenshots
└── docker-compose.yml
```

## 🛠 Tecnologias Utilizadas

### Backend

- **Node.js** com **Express 5**
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação de usuários
- **Bcrypt** - Hash de senhas
- **CORS** - Comunicação entre frontend e backend

### Frontend

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Chakra UI** - Componentes de interface
- **Redux Toolkit** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Tailwind CSS** - Estilização

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação com Docker (Recomendado)

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd auto-control
   ```

2. **Crie o arquivo `.env` na raiz do projeto**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas configurações (veja seção [Variáveis de Ambiente](#-variáveis-de-ambiente))

3. **Inicie os containers**

   ```bash
   docker-compose up -d
   ```

4. **Execute as migrations do banco de dados**

   ```bash
   docker-compose exec backend npx prisma migrate dev
   ```

5. **Opcional: Execute o seed para popular o banco**

   ```bash
   docker-compose exec backend npm run seed
   ```

6. **Acesse a aplicação**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

### Instalação Manual

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd auto-control
   ```

2. **Configure o banco de dados PostgreSQL**

   - Crie um banco de dados PostgreSQL
   - Configure as variáveis de ambiente no arquivo `.env`

3. **Instale as dependências do backend**

   ```bash
   cd backend
   npm install
   ```

4. **Configure o Prisma**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Opcional: Execute o seed**

   ```bash
   npm run seed
   ```

6. **Inicie o backend**

   ```bash
   npm run dev
   ```

7. **Em outro terminal, instale as dependências do frontend**

   ```bash
   cd frontend
   npm install
   ```

8. **Inicie o frontend**

   ```bash
   npm run dev
   ```

9. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no exemplo abaixo:

```env
# Banco de Dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_aqui
POSTGRES_DB=auto_control
DATABASE_URL=postgresql://postgres:sua_senha_aqui@localhost:5432/auto_control?schema=public

# Backend
PORT=3000
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
FRONTEND_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Descrição das Variáveis

- **POSTGRES_USER**: Usuário do PostgreSQL
- **POSTGRES_PASSWORD**: Senha do PostgreSQL
- **POSTGRES_DB**: Nome do banco de dados
- **DATABASE_URL**: URL completa de conexão com o banco de dados (usado pelo Prisma)
- **PORT**: Porta em que o backend será executado
- **JWT_SECRET**: Chave secreta para assinatura de tokens JWT (use uma string longa e aleatória)
- **FRONTEND_URL**: URL do frontend para configuração de CORS
- **NEXT_PUBLIC_API_URL**: URL da API backend (deve ser acessível pelo navegador)

> **⚠️ Importante**: Nunca commite o arquivo `.env` no repositório. Mantenha-o apenas localmente.

## 📸 Telas do Sistema

### Tela de Login

![Login](./docs/screenshots/login.png)

Tela de autenticação do sistema, permitindo acesso seguro aos usuários cadastrados.

### Visão Geral

![Visão Geral](./docs/screenshots/visao-geral.png)

Dashboard principal com visão geral das operações e estatísticas.

### Listagem de Notas

![Listagem de Notas](./docs/screenshots/listagem-de-notas.png)

Interface para visualizar e gerenciar todas as notas de serviço cadastradas.

### Cadastro de Notas

![Cadastro de Notas](./docs/screenshots/cadastro-de-notas.png)

Formulário completo para criação de novas notas de serviço, incluindo seleção de cliente, veículo e peças.

---

Desenvolvido para facilitar a gestão de oficinas mecânicas.
