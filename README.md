# Sistema de Revenda de Carros

Este é um sistema de revenda de carros desenvolvido com NestJS, Bootstrap e MySQL.

## Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados MySQL:
   - Crie um banco de dados chamado `revenda_carros`
   - Ajuste as credenciais do banco de dados no arquivo `src/app.module.ts`

4. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```

5. Abra o frontend:
   - Navegue até a pasta `frontend`
   - Abra o arquivo `index.html` em seu navegador

## Estrutura do Projeto

- `frontend/`: Contém os arquivos do frontend (HTML, CSS, JS)
- `src/`: Contém os arquivos do backend NestJS
  - `configurador/`: Módulo principal do configurador de veículos
  - `entities/`: Definições das entidades do TypeORM

## Funcionalidades

- Configuração de veículos
- Seleção de pinturas e opcionais
- Cálculo automático de preços
- Diferentes modalidades de preço (Zona Franca, PCD, Taxi)
