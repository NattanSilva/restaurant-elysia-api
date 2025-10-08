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

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let secondUserSession: LoginRespose = {} as LoginRespose
let testRestaurantId = ''

beforeAll(async () => {
  await cleanTestDatabase()

  await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')
  await insertUserInDatabase('faker@mail.com', '12345678', 'Faker')

  firstUserSession = await fakeLogin('JohnDoe@mail.com', '12345678', 'John Doe')
  secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')

  const { createdRestaurant } = await registRestaurant(
    '87999999922',
    'Product Test Restaurant',
    firstUserSession.response.user.id,
    firstUserSession.response.user.email
  )

  if (!createdRestaurant) {
    console.error('Error creating test restaurant')
    process.exit(1)
  }

  testRestaurantId = createdRestaurant.id
})

describe('Delete Restaurant Route', () => {
  it('sould not be able to delete a restaurant with invalid type id', async () => {
    const { status } = await api
      .restaurants({
        restaurantId: '123',
      })
      .delete(
        {},
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(422)
  })

  it('sould not be able to delete a restaurant with invalid uuid', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: '123e4567-e89b-12d3-a456-426614174025',
      })
      .delete(
        {},
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(404)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to delete a restaurant without authentication', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: testRestaurantId,
      })
      .delete({})

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to delete a restaurant if you are not the owner', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: testRestaurantId,
      })
      .delete(
        {},
        {
          headers: {
            cookie: secondUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould be able to delete a restaurant', async () => {
    const { status } = await api
      .restaurants({
        restaurantId: testRestaurantId,
      })
      .delete(
        {},
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(204)
  })
})
