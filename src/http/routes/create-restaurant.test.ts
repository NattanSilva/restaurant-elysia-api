import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'
import { app } from '@/http/app'
import { fakeLogin } from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'

const api = treaty<typeof app>(app)
const session = await fakeLogin()

beforeEach(async () => {
  await db
    .delete(restaurants)
    .where(eq(restaurants.owner, session.response.user.id))
})

describe('Create Restaurant Route', () => {
  it('should not be able to create a new restaurant without authentication', async () => {
    const { status, error } = await api.restaurants.post({
      name: 'Johns Pizza',
      contact: '87999999999',
    })

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('should not be able to create a new restaurant with wrong body', async () => {
    const { status } = await api.restaurants.post(
      {
        name: 'Johns Pizza 2',
        contact: '',
      },
      {
        headers: {
          cookie: session.headers.getSetCookie(),
        },
      }
    )

    expect(status).toBe(422)
  })

  it('should not be able to create a duplicated restaurant', async () => {
    await api.restaurants.post(
      {
        name: 'Johns Pizza',
        contact: '87999999999',
      },
      {
        headers: {
          cookie: session.headers.getSetCookie(),
        },
      }
    )

    const { status, error } = await api.restaurants.post(
      {
        name: 'Johns Pizza',
        contact: '87999999999',
      },
      {
        headers: {
          cookie: session.headers.getSetCookie(),
        },
      }
    )

    expect(status).toBe(409)
    expect(error).toHaveProperty('message')
  })

  it('should be able to create a new restaurant', async () => {
    const { status, data } = await api.restaurants.post(
      {
        name: 'Johns Pizza',
        contact: '87999999999',
      },
      {
        headers: {
          cookie: session.headers.getSetCookie(),
        },
      }
    )

    type Restaurant = {
      id: string
      name: string
      contact: string
      owner: string
      createdAt: string
      updatedAt: string
    }

    const restaurant = data as Restaurant

    expect(status).toBe(201)
    expect(data).toHaveProperty('id')
    expect(restaurant.owner).toBe(session.response.user.id)
  })
})
