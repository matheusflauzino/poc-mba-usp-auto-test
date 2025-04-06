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

