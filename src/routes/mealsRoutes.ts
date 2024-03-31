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
      in_diet: z.boolean(),
    })

    const sessionId = request.cookies.sessionId

    const user = await knex('users')
      .where({
        session_id: sessionId,
      })
      .select('id')
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    const body = createMealBodySchema.parse(request.body)

    const { name, description } = body
    await knex('meals').insert({
      id: randomUUID(),
      userid: user.id,
      name,
      description,
      in_diet: body.in_diet,
    })

    return reply.status(201).send()
  })
}
