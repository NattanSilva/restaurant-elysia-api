import { listRestaurants } from '@/app/functions/listRestaurants'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'
import { app } from '../app'

const api = treaty<typeof app>(app)

describe('Retrieve Restaurant Route', () => {
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
    const { restaurants } = await listRestaurants()

    const { status, data } = await api
      .restaurants({
        restaurantId: restaurants[0].id,
      })
      .get()

    expect(status).toBe(200)

    if (restaurants.length > 0) {
      expect(data).not.toBe(null)
      expect(data?.id).toBe(restaurants[0].id)
      expect(data?.name).toBe(restaurants[0].name)
      expect(data?.contact).toBe(restaurants[0].contact)
      expect(data?.owner).toBe(restaurants[0].owner)
      expect(data?.createdAt).toEqual(restaurants[0].createdAt)
      expect(data?.updatedAt).toEqual(restaurants[0].updatedAt)
    }
  })
})
