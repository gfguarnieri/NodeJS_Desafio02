# Daily Diet API

Proposta de solução para o Desafio 02 do Curso de Node.JS da Rocketseat. 

API para controle de dieta diária.

## Requisitos funcionais
- [ ] Deve ser possível criar um usuário
- [ ] Deve ser possível identificar o usuário entre as requisições
- [ ] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [ ] Deve ser possível apagar uma refeição
- [ ] Deve ser possível listar todas as refeições de um usuário
- [ ] Deve ser possível visualizar uma única refeição
- [ ] Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta

## Regras de negócio
- [ ] As refeições devem ser relacionadas a um usuário.
- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
- [ ] Utilizar cookie para identificação dos usuários.
- [ ] Utilizar migration para estruturação das tabelas.
## Tecnologias utilizadas

- Fastify
- Knex
- Zod
- Vitest
- Supertest
