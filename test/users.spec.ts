import { execSync } from 'child_process'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Users routes', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to insert a user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)
  })
})
