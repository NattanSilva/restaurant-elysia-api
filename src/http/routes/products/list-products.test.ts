import { registProduct } from '@/app/functions/products/registProduct'
import { registRestaurant } from '@/app/functions/registRestaurant'
import { app } from '@/http/app'
import {
  cleanTestDatabase,
  fakeLogin,
  insertUserInDatabase,
  type LoginRespose,
} from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let secodnUserSession: LoginRespose = {} as LoginRespose
let restaurantId = ''
let secondRestaurantId = ''

describe('List Products Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')

    await insertUserInDatabase('faker@mail.com', '12345678', 'Faker')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )
    secodnUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')

    try {
      const { createdRestaurant, status } = await registRestaurant(
        '87999999922',
        'Product Test Restaurant',
        firstUserSession.response.user.id,
        firstUserSession.response.user.email
      )

      if (!createdRestaurant || status !== 201) {
        console.error('Error creating test restaurant')
        process.exit(1)
      }

      restaurantId = createdRestaurant.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    try {
      const { createdRestaurant, status } = await registRestaurant(
        '87999999988',
        'Second Product Test Restaurant',
        secodnUserSession.response.user.id,
        secodnUserSession.response.user.email
      )

      if (!createdRestaurant || status !== 201) {
        console.error('Error creating second test restaurant')
        process.exit(1)
      }

      secondRestaurantId = createdRestaurant.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    try {
      await registProduct({
        name: 'Product 1',
        price: '9.99',
        producer: restaurantId,
        stock: 10,
        imageUrl: 'https://example.com/image.jpg',
      })

      await registProduct({
        name: 'Product 2',
        price: '12.99',
        producer: secondRestaurantId,
        stock: 10,
        imageUrl: 'https://example.com/image2.jpg',
      })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })

  it('should be able to list all products', async () => {
    const { data, status } = await api.products.get()

    expect(status).toBe(200)
    expect(data).not.toBe(null)
    expect(data).toHaveLength(2)

    if (data) {
      expect(data[0]).toHaveProperty('id')
      expect(data[0]).toHaveProperty('name')
      expect(data[0]).toHaveProperty('price')
      expect(data[0]).toHaveProperty('imageUrl')
      expect(data[0]).toHaveProperty('stock')
      expect(data[0]).toHaveProperty('producer')
      expect(data[0]).toHaveProperty('createdAt')
      expect(data[0]).toHaveProperty('updatedAt')
      expect(data[0].producer).toBe(restaurantId)
    }
  })

  it('should not be able to list all products from a specific restaurant with invalid type id', async () => {
    const { status, error } = await api.products.get({
      query: {
        producerId: 'invalid-id',
      },
    })

    expect(status).toBe(422)
    expect(error).toHaveProperty('message')
  })

  it('should not be able to list all products from a specific restaurant with invalid id', async () => {
    const { status, data } = await api.products.get({
      query: {
        producerId: '123e4567-e89b-12d3-a456-4266141740Ac',
      },
    })

    expect(status).toBe(200)
    expect(data).toHaveLength(0)
  })

  it('should be able to list all products from a specific restaurant', async () => {
    const { data, status } = await api.products.get({
      query: {
        producerId: secondRestaurantId,
      },
    })

    expect(status).toBe(200)
    expect(data).not.toBe(null)
    expect(data).toHaveLength(1)

    if (data) {
      expect(data[0].producer).toBe(secondRestaurantId)
    }
  })
})
