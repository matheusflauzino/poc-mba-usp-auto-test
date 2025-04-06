# POC MBA USP - Auto Test Fintech

Este projeto é uma prova de conceito (POC) desenvolvida para o MBA da USP, focando em uma implementação de backend para uma fintech utilizando Clean Architecture em TypeScript, com foco em geração automática de testes unitários.

## Objetivo Geral

Criar um backend simplificado em TypeScript utilizando Clean Architecture, que simule operações financeiras básicas e típicas de uma fintech, oferecendo endpoints bem definidos para facilitar a geração e aplicação dos testes unitários automáticos criados pela ferramenta CLI (auto-test) baseada em LLMs.

## Requisitos Funcionais

### 1. Gestão de Contas
- Criar uma nova conta bancária com informações básicas:
  - Nome do titular
  - Documento (CPF/CNPJ)
  - Saldo inicial (opcional, padrão 0)
- Consultar informações básicas da conta:
  - Dados do titular
  - Saldo atual da conta
- Encerrar uma conta existente

### 2. Operações Financeiras
- Depósito em conta
  - Adicionar fundos a uma conta existente
  - Validar valor positivo para depósito
- Saque de conta
  - Retirar fundos de uma conta existente
  - Validar saldo suficiente antes de realizar o saque
  - Validar valor positivo para saque
- Transferência entre contas
  - Transferir fundos entre duas contas existentes
  - Validar saldo suficiente na conta de origem
  - Validar existência das duas contas envolvidas na operação

## Tecnologias Utilizadas

- TypeScript
- Clean Architecture
- Vitest (para testes)
- Node.js
- Express.js

## Estrutura do Projeto

O projeto segue os princípios da Clean Architecture, com as seguintes camadas:

```
src/
├── adapters/      # Adaptadores para frameworks e drivers
├── entities/      # Entidades de domínio
├── infra/         # Configurações de infraestrutura
├── shared/        # Código compartilhado
└── use-cases/     # Casos de uso da aplicação
```

## Casos de Uso Implementados

O projeto implementa os seguintes casos de uso, seguindo os princípios da Clean Architecture:

```
src/
├── adapters/
│   ├── controllers/      # Controladores HTTP
│   │   ├── account.controller.ts
│   │   └── loan.controller.ts
│   └── presenters/       # Formatadores de resposta
│       ├── account.presenter.ts
│       ├── close-account.presenter.ts
│       ├── deposit-account.presenter.ts
│       ├── get-account.presenter.ts
│       ├── withdraw-account.presenter.ts
│       ├── transfer-account.presenter.ts
│       └── loan-simulation.presenter.ts
│
├── entities/             # Entidades de domínio
│   ├── account.entity.ts
│   └── loan.entity.ts
│
├── infra/                # Configurações de infraestrutura
│   ├── config/           # Configurações
│   │   └── env.ts
│   ├── database/         # Conexão com banco de dados
│   │   └── connection.ts
│   ├── repositories/     # Repositórios
│   │   ├── account.repository.ts
│   │   └── loan.repository.ts
│   └── server/           # Configuração do servidor
│       ├── app.ts
│       └── routes/
│           ├── account.routes.ts
│           └── loan.routes.ts
│
├── shared/               # Código compartilhado
│   ├── errors/           # Classes de erro
│   │   └── index.ts
│   └── utils/            # Utilitários
│       └── logger.ts
│
└── use-cases/            # Casos de uso da aplicação
    ├── api/              # Casos de uso da API
    │   ├── close-account/           # Encerrar conta
    │   │   ├── close-account.dto.ts
    │   │   ├── close-account.gateway.ts
    │   │   ├── close-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   ├── create-account/           # Criar conta
    │   │   ├── create-account.dto.ts
    │   │   ├── create-account.gateway.ts
    │   │   ├── create-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   ├── deposit-account/          # Depósito em conta
    │   │   ├── deposit-account.dto.ts
    │   │   ├── deposit-account.gateway.ts
    │   │   ├── deposit-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   ├── get-account/              # Consultar conta
    │   │   ├── get-account.dto.ts
    │   │   ├── get-account.gateway.ts
    │   │   ├── get-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   ├── withdraw-account/         # Saque de conta
    │   │   ├── withdraw-account.dto.ts
    │   │   ├── withdraw-account.gateway.ts
    │   │   ├── withdraw-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   ├── transfer-account/         # Transferência entre contas
    │   │   ├── transfer-account.dto.ts
    │   │   ├── transfer-account.gateway.ts
    │   │   ├── transfer-account.interactor.ts
    │   │   └── index.ts
    │   │
    │   └── loan-simulation/          # Simulação de empréstimo
    │       ├── loan-simulation.dto.ts
    │       ├── loan-simulation.gateway.ts
    │       ├── loan-simulation.interactor.ts
    │       └── index.ts
    │
    └── index.ts                      # Exportações dos casos de uso
```

### Detalhamento dos Casos de Uso

#### 1. Criar Conta (Create Account)
- **Descrição**: Permite a criação de uma nova conta bancária.
- **Entrada**: Nome do titular, documento (CPF/CNPJ), email.
- **Saída**: Dados da conta criada, incluindo identificador único.
- **Validações**:
  - Nome, documento e email são obrigatórios.
  - Documento deve ser válido (CPF ou CNPJ).

#### 2. Consultar Conta (Get Account)
- **Descrição**: Retorna os dados de uma conta existente.
- **Entrada**: Identificador da conta.
- **Saída**: Dados completos da conta.
- **Validações**:
  - Identificador da conta é obrigatório.
  - Conta deve existir.

#### 3. Encerrar Conta (Close Account)
- **Descrição**: Encerra uma conta existente.
- **Entrada**: Identificador da conta.
- **Saída**: Confirmação do encerramento.
- **Validações**:
  - Identificador da conta é obrigatório.
  - Conta deve existir.

#### 4. Depósito em Conta (Deposit Account)
- **Descrição**: Adiciona fundos a uma conta existente.
- **Entrada**: Identificador da conta e valor a ser depositado.
- **Saída**: Dados atualizados da conta.
- **Validações**:
  - Identificador da conta é obrigatório.
  - Valor deve ser positivo.
  - Conta deve existir.

#### 5. Saque de Conta (Withdraw Account)
- **Descrição**: Retira fundos de uma conta existente.
- **Entrada**: Identificador da conta e valor a ser sacado.
- **Saída**: Dados atualizados da conta.
- **Validações**:
  - Identificador da conta é obrigatório.
  - Valor deve ser positivo.
  - Conta deve existir.
  - Saldo deve ser suficiente para o saque.

#### 6. Transferência entre Contas (Transfer Account)
- **Descrição**: Transfere fundos de uma conta para outra.
- **Entrada**: Identificador da conta de origem, identificador da conta de destino e valor a ser transferido.
- **Saída**: Dados atualizados das duas contas.
- **Validações**:
  - Identificadores das contas são obrigatórios.
  - Valor deve ser positivo.
  - Ambas as contas devem existir.
  - Conta de origem deve ter saldo suficiente.
  - Contas de origem e destino devem ser diferentes.

#### 7. Simulação de Empréstimo (Loan Simulation)
- **Descrição**: Simula um empréstimo com base no saldo da conta.
- **Entrada**: Identificador da conta e valor desejado para o empréstimo.
- **Saída**: Detalhes da simulação, incluindo valor aprovado, taxa de juros e parcelas.
- **Validações**:
  - Identificador da conta é obrigatório.
  - Valor desejado deve ser positivo.
  - Conta deve existir.

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute os testes:
   ```bash
   npm test
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```

## Testes

O projeto utiliza Vitest para testes unitários. Para executar os testes:

```bash
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

