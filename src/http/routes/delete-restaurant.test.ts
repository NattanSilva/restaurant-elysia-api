import { listRestaurants } from '@/app/functions/listRestaurants'

import { fakeLogin, type LoginRespose } from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../app'

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let secondUserSession: LoginRespose = {} as LoginRespose

beforeAll(async () => {
  firstUserSession = await fakeLogin('JohnDoe@mail.com', '12345678', 'John Doe')
  secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')
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
    const { restaurants } = await listRestaurants()
    const { status, error } = await api
      .restaurants({
        restaurantId: restaurants[0].id,
      })
      .delete({})

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to delete a restaurant if you are not the owner', async () => {
    const { restaurants } = await listRestaurants()
    const { status, error } = await api
      .restaurants({
        restaurantId: restaurants[0].id,
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
    const { restaurants } = await listRestaurants()
    const { status } = await api
      .restaurants({
        restaurantId: restaurants[0].id,
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
