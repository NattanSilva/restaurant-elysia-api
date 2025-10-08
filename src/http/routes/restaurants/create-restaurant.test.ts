import { app } from '@/http/app'
import {
  cleanTestDatabase,
  fakeLogin,
  insertUserInDatabase,
  type LoginRespose,
} from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'

export type ErrorValidationResponse = {
  status: 422
  value: {
    type: 'validation'
    on: string
    summary?: string
    message?: string
    found?: unknown
    property?: string
    expected?: string
  }
}

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose

describe('Create Restaurant Route', async () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )
  })

  it('should not be able to create a new restaurant without authentication', async () => {
    const { status, error } = await api.restaurants.post({
      name: 'Johns Pizza',
      contact: '87999999999',
    })

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('should not be able to create a new restaurant with wrong body', async () => {
    const { status, error } = await api.restaurants.post(
      {
        name: 'Johns Pizza 2',
        contact: '',
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(responseError.status).toBe(422)
    expect(responseError.value.type).toBe('validation')
    expect(responseError?.value).toHaveProperty('message')
  })

  it('should be able to create a new restaurant', async () => {
    const { status, data } = await api.restaurants.post(
      {
        name: 'Johns Pizza',
        contact: '87999999977',
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
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
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('contact')
    expect(data).toHaveProperty('owner')
    expect(data).toHaveProperty('createdAt')
    expect(data).toHaveProperty('updatedAt')
    expect(restaurant.owner).toBe(firstUserSession.response.user.id)
  })

  it('should not be able to create a duplicated restaurant', async () => {
    const { status, error } = await api.restaurants.post(
      {
        name: 'Johns Pizza',
        contact: '87999999977',
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    expect(status).toBe(409)
    expect(error).toHaveProperty('message')
  })
})
