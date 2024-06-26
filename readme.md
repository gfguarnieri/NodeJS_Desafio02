# Daily Diet API

Proposta de solução para o Desafio 02 do Curso de Node.JS da Rocketseat. 

API para controle de dieta diária.

## Requisitos funcionais
- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - [x] Quantidade total de refeições registradas
    - [x] Quantidade total de refeições dentro da dieta
    - [x] Quantidade total de refeições fora da dieta
    - [x] Melhor sequência de refeições dentro da dieta

## Regras de negócio
- [x] As refeições devem ser relacionadas a um usuário.
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
- [x] Utilizar cookie para identificação dos usuários.
- [x] Utilizar migration para estruturação das tabelas.

## Testes e2e

- [x] Rotas de Usuário 
- [x] Rotas de Refeições;

## Tecnologias utilizadas
- Fastify
- Knex
- Zod
- Vitest
- Supertest

## Scripts

Para executar projeto em ambiente de teste

```
npm run dev
```

Para executar testes e2e

```
npm run test
```

Para criar build para deploy

```
npm run build
```