# Projeto Gateway de Pagamento Fictício

Este projeto simula um gateway de pagamento com ênfase em arquitetura limpa, segurança e testes automatizados, servindo como base para ambientes reais.

---

## 📁 Estrutura do projeto

```
src
    ├── application
    │   └── use-cases
    │       ├── CreatePayment.ts
    │       ├── CreateRefund.ts
    │       ├── FindPaymentById.ts
    │       ├── FindRefundById.ts
    │       ├── ModifyStatusPayment.ts
    │       └── ModifyStatusRefund.ts
    ├── domain
    │   ├── entities
    │   │   ├── Payment.ts
    │   │   └── Refund.ts
    │   └── repositories
    │       ├── PaymentRepository.ts
    │       └── RefundRepository.ts
    ├── infrastructure
    │   └── db
    │       ├── migrations
    │       │   ├── createPaymentTable.ts
    │       │   └── createRefundTable.ts
    │       ├── mysql
    │       │   ├── MySQLPaymentRepository.ts
    │       │   └── MySQLRefundRepository.ts
    │       └── connection.ts
    ├── interfaces
    │   └── http
    │       ├── controllers
    │       │   ├── PaymentController.ts
    │       │   └── RefundController.ts
    │       ├── routes
    │       │   ├── paymentRoutes.ts
    │       │   └── refundRoutes.ts
    │       ├── schemas
    │       │   ├── paymentSchemas.ts
    │       │   └── refundSchemas.ts
    │       └── swagger
    │           └── index.ts
    ├── scripts
    │   └── migrate.ts
    ├── shared
    │   ├── schemasValidations
    │   │   ├── PaymentSchemas.ts
    │   │   └── RefundSchemas.ts
    │   └── utils
    │       └── crypt.ts
    ├── tests
    │   ├── integrations
    │   │   ├── payments
    │   │   │   └── payment.test.ts
    │   │   ├── refunds
    │   │   │   └── refunds.test.ts
    │   │   └── app.ts
    │   └── units
    │       ├── encrypt
    │       │   └── encrypt.test.ts
    │       └── use-cases
    │           ├── CreatePayment.test.ts
    │           ├── CreateRefund.test.ts
    │           ├── FindPaymentById.test.ts
    │           ├── FindRefundById.test.ts
    │           ├── ModifyStatusPayment.test.ts
    │           └── ModifyStatusRefund.test.ts
    └── server.ts
```

## 🔧 Tecnologias e implementações

- **Node.js**: Versão LTS (18+)
- **Framework**: Fastify
- **Validação**: Zod
- **Linguagem**: TypeScript
- **Documentação**: Swagger (OpenAPI)
- **Variáveis de Ambiente**
- **Criptografia**: Dados de cartão de crédito estão sendo criptografados
- **Banco de Dados e API**: Ambos rodando em containers Docker
- **Testes**: Foram feitos testes de integração e unitários
- **Arquitetura**: Foi utilizada a arquitetura limpa (Clean Architecture)

---

## 🔧 Funcionalidades

Este sistema simula um fluxo de pagamentos com foco em organização, segurança e boas práticas. As principais funcionalidades implementadas são:

### ✅ Criação de Pagamentos

- Permite criar um novo pagamento com dados como valor, método e status.
- Validação rigorosa dos dados de entrada [Zod](https://zod.dev/).
- Criptografia dos dados do cartão de crédito antes do armazenamento.

### 🔁 Alteração de Status do Pagamento

- Possibilita atualizar o status de um pagamento existente.
- Utiliza um caso de uso específico (`ModifyStatusPayment`) para isolar a regra de negócio.

### 💸 Reembolso (Refund)

- Criação e gerenciamento de reembolsos vinculados a pagamentos.
- Suporte para alteração de status de reembolsos.

### 🧪 Testes Automatizados

- Testes de integração cobrindo os principais fluxos das rotas.
- Testes unitários dos casos de uso, utilizando mocks nos repositórios.
- Utilização do `Jest` e `supertest` para validação do comportamento da API.

### 🧱 Arquitetura Limpa

- Separação entre camadas de controller, caso de uso, entidade e repositório.
- Facilidade para testar, manter e escalar o sistema.

### 🔐 Segurança

- Dados sensíveis como informações de cartão são criptografados antes de persistência.
- As validações impedem dados inconsistentes de chegarem à lógica de negócio.

---

## Instalação

## ⚙️ Configuração do Ambiente (.env)

Antes de iniciar o projeto, é necessário criar um arquivo `.env` na raiz com as seguintes variáveis de ambiente:

```env
# Porta em que o servidor será executado
SERVER_PORT=3000

# Chave de criptografia para dados sensíveis (ex: cartão)
# Modifique a chave se desejar
ENCRYPTION_KEY=chave-secreta

# Configurações do banco de dados MySQL
# A configuração atual está de acordo com o docker-compose
DB_HOST=db
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_DATABASE=payments
```

### 🚀 Executando o Projeto com Docker Compose

O projeto já está configurado para rodar com Docker e Docker Compose. Siga os passos abaixo para iniciar o ambiente completo:

### 📦 Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### ▶️ Subindo os containers

Execute o seguinte comando na raiz do projeto:

```bash
docker compose up -d
```

- Criar um container para o banco de dados MySQL.

- Subir a aplicação backend na porta definida (SERVER_PORT, ex: 3000).

### 🐳 Justificativa do uso do Docker Compose

O Docker Compose foi utilizado para facilitar a execução e o gerenciamento dos containers do backend e do MySQL de forma padronizada e eficiente. Ele garante isolamento de ambiente, elimina problemas de configuração manual e permite que o sistema seja executado de maneira consistente em qualquer máquina. Além disso, torna mais simples a comunicação entre os serviços, melhora a portabilidade do projeto e prepara o ambiente para futuras extensões com outros serviços, como cache ou filas.

### 🚀 Rodando o Projeto Localmente (sem Docker)

Siga os passos abaixo para executar o projeto em ambiente local, sem o uso do Docker:

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão recomendada: 18+)
- [MySQL](https://www.mysql.com/) instalado e em execução
- Um gerenciador de pacotes (npm ou yarn)

### 2. Instalação das dependências

```bash
npm install
# ou
yarn install

```

### 3. Configuração do Banco de Dados

Crie um banco de dados MySQL com os seguintes dados (ou ajuste conforme necessário no seu `.env`):

- **DB_Host**: `localhost`
- **DB_PORT**: `3306`
- **DB_USER**: `root` (ou outro configurado)
- **DB_PASSWORD**: `sua_senha`
- **DB_DATABASE**: `payments`

Execute o arquivo `tables.sql`, localizado na raiz do projeto, para criar as tabelas. Ou, se preferir uma forma mais prática, execute o seguinte comando:

```bash

    npm run migrate
```

## 📖 Acessando a Documentação Swagger

📖 Acesse a documentação Swagger em: [http://localhost:3000/docs](http://localhost:3000/docs)

## 🧪 Rodando os Testes

O projeto utiliza **Jest** para os testes automatizados. Siga os passos abaixo para executar os testes:

#### 1. Crie o arquivo `.env.test.local`

#### 2. Abra o arquivo `.env.test.local` e cole as variáveis de ambiente:

```env

SERVER_PORT=3000
ENCRYPTION_KEY=chave-secreta
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_DATABASE=payments

```

#### 3. Executando os testes

```bash
    npm test
```

## Exemplo de Payloads

### Criar Pagamento (Cartão de Crédito)

```json
POST /payments
{
  "method": "credit_card",
  "amount": 100.00,
  "card": {
    "encryptedData": "8375364593299887"
  },
  "buyer": {
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Criar Pagamento (PIX)

```json
POST /payments
{
  "method": "pix",
  "amount": 50.00,
  "buyer": {
    "name": "Maria Souza",
    "email": "maria@email.com"
  }
}
```

### Obter Pagamento

```json
GET /payments/1
```

### Obter Reembolso

```json
GET /refund/1
```

### Reembolso Parcial

```json
POST /payments/refund-partial
{
  "paymentId": 1,
  "amount": 20.00
}
```

### Reembolso Total

```json
POST /payments/refund
{
  "paymentId": 1
}
```

### Atualizar status do pagamento

```json
PATCH /payments/status/1
{
  "status": "completed"
}
```

### Atualizar status do reembolso

```json
PATCH /refund/status/1
{
  "status": "completed"
}
```

---
