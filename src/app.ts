import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/usersRoutes'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
