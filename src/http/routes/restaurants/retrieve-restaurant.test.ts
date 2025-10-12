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

export type Restaurant = {
  name: string
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  owner: string
  contact: string
}

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let testRestaurant: Restaurant = {} as Restaurant

describe('Retrieve Restaurant Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )

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

    testRestaurant = createdRestaurant
  })

  it('sould not be able to retrieve a restaurant with invalid type id', async () => {
    const { status } = await api
      .restaurants({
        restaurantId: '123',
      })
      .get()

    expect(status).toBe(422)
  })

  it('sould not be able to retrieve a restaurant with invalid id', async () => {
    const { status, error } = await api
      .restaurants({
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
      })
      .get()

    expect(status).toBe(404)
    expect(error).toHaveProperty('message')
  })

  it('sould be able to retrieve a restaurant', async () => {
    const { status, data } = await api
      .restaurants({
        restaurantId: testRestaurant.id,
      })
      .get()

    expect(status).toBe(200)
    expect(data).not.toBe(null)

    if (data) {
      expect(data).not.toBe(null)
      expect(data?.id).toBe(testRestaurant.id)
      expect(data?.name).toBe(testRestaurant.name)
      expect(data?.contact).toBe(testRestaurant.contact)
      expect(data?.owner).toBe(testRestaurant.owner)
      expect(data?.createdAt).toEqual(testRestaurant.createdAt)
      expect(data?.updatedAt).toEqual(testRestaurant.updatedAt)
    }
  })
})
