import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals routes', () => {
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

  it('should be able to insert a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)
    const cookie = createUserResponse.get('Set-Cookie')
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Picanha',
        inDiet: true,
      })
      .set('Cookie', cookie![0])
      .expect(201)
  })

  it('should be able to remove a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Picanha',
        inDiet: true,
      })
      .set('Cookie', cookie![0])

    const getListMeals = await request(app.server)
      .get('/meals')
      .send()
      .set('Cookie', cookie![0])

    const { id } = getListMeals.body.meals[0]

    await request(app.server)
      .delete(`/meals/${id}`)
      .send()
      .set('Cookie', cookie![0])
      .expect(204)
  })

  it('should be able to update a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Picanha',
        inDiet: true,
      })
      .set('Cookie', cookie![0])

    const getListMealsBeforeUpdate = await request(app.server)
      .get('/meals')
      .send()
      .set('Cookie', cookie![0])

    const { id } = getListMealsBeforeUpdate.body.meals[0]

    await request(app.server)
      .put(`/meals/${id}`)
      .send({
        name: 'Carne',
        description: 'Fraldinha',
        createdAt: '2024-06-17 08:00:52',
        inDiet: true,
      })
      .set('Cookie', cookie![0])
      .expect(204)

    const getListMealsAfterUpdate = await request(app.server)
      .get('/meals')
      .send()
      .set('Cookie', cookie![0])

    const { meals } = getListMealsAfterUpdate.body

    expect(meals[0]).toEqual(
      expect.objectContaining({
        name: 'Carne',
        description: 'Fraldinha',
      }),
    )
  })

  it('should be able to get a list of meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Picanha',
        inDiet: true,
      })
      .set('Cookie', cookie![0])

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Fraldinha',
        inDiet: false,
      })
      .set('Cookie', cookie![0])

    const getListMeals = await request(app.server)
      .get('/meals')
      .send()
      .set('Cookie', cookie![0])

    expect(getListMeals.body.meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Carne',
          description: 'Picanha',
        }),
        expect.objectContaining({
          name: 'Carne',
          description: 'Fraldinha',
        }),
      ]),
    )
  })

  it('should be able to get metrics of meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)

    const cookie = createUserResponse.get('Set-Cookie')

    for (let i = 0; i < 5; i++) {
      await request(app.server)
        .post('/meals')
        .send({
          name: 'Carne',
          description: 'Picanha',
          inDiet: true,
        })
        .set('Cookie', cookie![0])
    }

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Fraldinha',
        inDiet: false,
      })
      .set('Cookie', cookie![0])

    const getListMeals = await request(app.server)
      .get('/meals/metrics')
      .send()
      .set('Cookie', cookie![0])

    const metrics = getListMeals.body

    expect(metrics).toEqual(
      expect.objectContaining({
        bestSequence: 5,
        offDiet: 1,
        onDiet: 5,
        totalMeals: 6,
      }),
    )
  })

  it('should be able to get a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Giovanni Guarnieri',
        email: 'gfguarnieri@hotmail.com',
      })
      .expect(201)

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Carne',
        description: 'Picanha',
        inDiet: true,
      })
      .set('Cookie', cookie![0])

    const getListMeals = await request(app.server)
      .get('/meals')
      .send()
      .set('Cookie', cookie![0])

    const { meals } = getListMeals.body

    const getMeal = await request(app.server)
      .get(`/meals/${meals[0].id}`)
      .send()
      .set('Cookie', cookie![0])

    expect(getMeal.body.meal).toEqual(
      expect.objectContaining({
        name: 'Carne',
        description: 'Picanha',
      }),
    )
  })
})
