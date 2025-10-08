import { registRestaurant } from '@/app/functions/registRestaurant'
import {
  cleanTestDatabase,
  fakeLogin,
  insertUserInDatabase,
  type LoginRespose,
} from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../../app'
import type { Restaurant } from './retrieve-restaurant.test'

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let secondUserSession: LoginRespose = {} as LoginRespose
let testRestaurant: Restaurant = {} as Restaurant

describe('Update Restaurant Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')
    await insertUserInDatabase('faker@mail.com', '12345678', 'Faker')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )
    secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')

    const { createdRestaurant, status } = await registRestaurant(
      '87999999922',
      'Product Test Restaurant',
      secondUserSession.response.user.id,
      secondUserSession.response.user.email
    )

    if (status !== 201 || !createdRestaurant) {
      console.error('Error creating test restaurant')
      process.exit(1)
    }

    testRestaurant = createdRestaurant

    await registRestaurant(
      '87999999999',
      'Same Restaurant',
      firstUserSession.response.user.id,
      firstUserSession.response.user.email
    )
  })

  it('sould not be able to update a restaurant with invalid type id', async () => {
    const { status } = await api
      .restaurants({
        restaurantId: '123',
      })
      .patch({
        name: 'Faker Pizza UPDATED',
        contact: '87999999998',
      })

    expect(status).toBe(422)
  })

  it('sould not be able to update a restaurant with invalid uuid', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: '123e4567-e89b-12d3-a456-426614174022',
      })
      .patch(
        {
          name: 'Faker Pizza UPDATED',
          contact: '87999999998',
        },
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(404)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to update a restaurant without authentication', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: testRestaurant.id,
      })
      .patch({
        name: 'Faker Pizza UPDATED',
        contact: '87999999998',
      })

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to update a restaurant if you are not the owner', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: testRestaurant.id,
      })
      .patch(
        {
          name: 'Faker Pizza UPDATED',
          contact: '87999999998',
        },
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to update a restaurant to repeated camp', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: testRestaurant.id,
      })
      .patch(
        {
          name: 'Same Restaurant',
          contact: '87999999999',
        },
        {
          headers: {
            cookie: secondUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(409)
    expect(error).toHaveProperty('message')
  })

  it('sould be able to update a restaurant', async () => {
    const { status, data } = await api
      .restaurants({
        restaurantId: testRestaurant.id,
      })
      .patch(
        {
          name: 'Faker Pizza UPDATED',
          contact: '87999999992',
        },
        {
          headers: {
            cookie: secondUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(200)
    expect(data).not.toBe(null)
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('contact')
    expect(data).toHaveProperty('owner')
    expect(data).toHaveProperty('createdAt')
    expect(data).toHaveProperty('updatedAt')
    expect(data?.name).toBe('Faker Pizza UPDATED')
  })
})
