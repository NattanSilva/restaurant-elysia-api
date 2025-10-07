import { fakeLogin, type LoginRespose } from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../../app'

const api = treaty<typeof app>(app)
let restaurantId = ''
let firstUserSession: LoginRespose = {} as LoginRespose
let secondUserSession: LoginRespose = {} as LoginRespose

beforeAll(async () => {
  firstUserSession = await fakeLogin('JohnDoe@mail.com', '12345678', 'John Doe')
  secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')
})

beforeAll(async () => {
  const { data, status } = await api.restaurants.post(
    {
      name: 'Faker Pizza',
      contact: '87999999998',
    },
    {
      headers: {
        cookie: secondUserSession.headers.getSetCookie(),
      },
    }
  )

  expect(status).toBe(201)

  type Restaurant = {
    id: string
    name: string
    contact: string
    owner: string
    createdAt: string
    updatedAt: string
  }

  const restaurant = data as Restaurant

  restaurantId = restaurant.id
})

describe('Update Restaurant Route', () => {
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
        restaurantId: restaurantId,
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
        restaurantId: restaurantId,
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
        restaurantId: restaurantId,
      })
      .patch(
        {
          name: 'Faker Pizza UPDATED',
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
        restaurantId: restaurantId,
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
  })
})
