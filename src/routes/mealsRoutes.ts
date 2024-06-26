import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
    })

    const sessionId = request.cookies.sessionId

    const user = await knex('users')
      .where({
        session_id: sessionId,
      })
      .select('id')
      .first()

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    const body = createMealBodySchema.parse(request.body)

    const { name, description } = body
    await knex('meals').insert({
      id: randomUUID(),
      userid: user.id,
      name,
      description,
      in_diet: body.inDiet,
    })

    return reply.status(201).send()
  })
  app.put('/:id', async (request, reply) => {
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
      createdAt: z.string(),
    })

    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id,
      })
      .first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    const { name, description, inDiet, createdAt } = updateMealBodySchema.parse(
      request.body,
    )
    await knex('meals').where({ id }).update({
      name,
      description,
      in_diet: inDiet,
      created_at: createdAt,
    })
    return reply.status(204).send()
  })
  app.delete('/:id', async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where({ id }).first()

    const sessionId = request.cookies.sessionId

    const user = await knex('users')
      .where({ session_id: sessionId })
      .select('id')
      .first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    if (meal.userid !== user.id) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    await knex('meals').where({ id }).delete()
    return reply.status(204).send()
  })
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    const user = await knex('users')
      .where({ session_id: sessionId })
      .select('id')
      .first()

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const mealsList = await knex('meals').where({ userid: user.id })

    return reply.send({
      meals: mealsList,
    })
  })
  app.get('/:id', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    const user = await knex('users')
      .where({ session_id: sessionId })
      .select('id')
      .first()

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const meal = await knex('meals').where({ userid: user.id, id }).first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    return reply.send({
      meal,
    })
  })
  app.get('/metrics', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    const user = await knex('users')
      .where({ session_id: sessionId })
      .select('id')
      .first()

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const countOffDiet = await knex('meals')
      .where({ userid: user.id, in_diet: false })
      .count('id', { as: 'count' })
      .first()

    const countOnDiet = await knex('meals')
      .where({ userid: user.id, in_diet: true })
      .count('id', { as: 'count' })
      .first()

    const allMeals = await knex('meals')
      .where({ userid: user.id })
      .orderBy('created_at', 'asc')
      .select()

    let sequence = 0
    let maxSequence = 0

    allMeals.forEach((m) => {
      if (m.in_diet) {
        sequence++
        if (sequence > maxSequence) {
          maxSequence = sequence
        }
      } else {
        sequence = 0
      }
    })

    const countAll = await knex('meals')
      .where({ userid: user.id })
      .count('id', { as: 'count' })
      .first()

    return reply.send({
      totalMeals: countAll?.count,
      onDiet: countOnDiet?.count,
      offDiet: countOffDiet?.count,
      bestSequence: maxSequence,
    })
  })
}
