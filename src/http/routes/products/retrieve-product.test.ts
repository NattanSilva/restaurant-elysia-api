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
let restaurantId = ''
let productId = ''

describe('Retrieve Products Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )

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
      const { createdProduct } = await registProduct({
        name: 'Product 1',
        price: '9.99',
        producer: restaurantId,
        stock: 10,
        imageUrl: 'https://example.com/image.jpg',
      })

      productId = createdProduct.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })

  it('should not be able to retrieve a product with invalid type id', async () => {
    const { error, status } = await api
      .products({
        productId: '12345678',
      })
      .get()

    expect(status).toBe(422)
    expect(error).toHaveProperty('message')
  })

  it('should not be able to retrieve a product with invalid id', async () => {
    const { error, status } = await api
      .products({
        productId: '123e4567-e89b-12d3-a456-426614174025',
      })
      .get()

    expect(status).toBe(404)
    expect(error).toHaveProperty('message')
  })

  it('should be able to retrieve a product', async () => {
    const { data, status } = await api
      .products({
        productId,
      })
      .get()

    expect(status).toBe(200)
    expect(data).not.toBe(null)

    if (data) {
      expect(data).toHaveProperty('id')
      expect(data.id).toBe(productId)
      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('price')
      expect(data).toHaveProperty('imageUrl')
      expect(data).toHaveProperty('stock')
      expect(data).toHaveProperty('producer')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data.producer).toBe(restaurantId)
    }
  })
})
