import { registRestaurant } from '@/app/functions/registRestaurant'
import { cleanTestDatabase, fakeLogin, insertUserInDatabase } from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../../app'

const api = treaty<typeof app>(app)
let restaurantId = ''

describe('List Restaurants Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')

    const firstUserSession = await fakeLogin(
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

    restaurantId = '' + createdRestaurant?.id
  })

  it('sould be able to list all restaurants', async () => {
    const { status, data } = await api.restaurants.get()

    expect(status).toBe(200)
    expect(data).not.toBe(null)

    if (data) {
      expect(data?.length).toBeGreaterThan(0)
      expect(data[0].id).toBe(restaurantId)
      expect(data).toBeInstanceOf(Array)
    }
  })
})
