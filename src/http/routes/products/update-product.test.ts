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
let secondUserSession: LoginRespose = {} as LoginRespose
let testRestaurantId = ''
let testProductId = ''

describe('Update Product Route', () => {
  beforeAll(async () => {
    await cleanTestDatabase()

    await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')
    await insertUserInDatabase('faker@mail.com', '12345678', 'Faker')

    firstUserSession = await fakeLogin(
      'JohnDoe@mail.com',
      '12345678',
      'John Doe'
    )
    secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')

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

      testRestaurantId = createdRestaurant.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    try {
      const { createdProduct, status } = await registProduct({
        imageUrl: 'https://example.com/image.jpg',
        name: 'Product 1',
        price: '9.99',
        producer: testRestaurantId,
        stock: 10,
      })

      if (!createdProduct || status !== 201) {
        console.error('Error creating test restaurant')
        process.exit(1)
      }

      testProductId = createdProduct.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })

  it('sould not be able to update a product with invalid type id', async () => {
    const { status, error } = await api
      .products({
        productId: '12345678',
      })
      .patch()

    expect(status).toBe(422)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to update a product with out authentication', async () => {
    const { status, error } = await api
      .products({
        productId: testProductId,
      })
      .patch()

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to update a product with invalid id', async () => {
    const { status, error } = await api
      .products({
        productId: '123e4567-e89b-12d3-a456-426614174025',
      })
      .patch(
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

  it('sould not be able to update a product from another user', async () => {
    const { status, error } = await api
      .products({
        productId: testProductId,
      })
      .patch(
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

  it('sould not be able to update a product with invalid data', async () => {
    const { status, error } = await api
      .products({
        productId: testProductId,
      })
      .patch(
        {
          name: '',
          price: -19.99,
          stock: -20,
        },
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(422)
    expect(error).toHaveProperty('message')
  })

  it('sould be able to update a product', async () => {
    const { data, status } = await api
      .products({
        productId: testProductId,
      })
      .patch(
        {
          name: 'Product 1 UPDATED',
          price: 19.99,
          stock: 20,
        },
        {
          headers: {
            cookie: firstUserSession.headers.getSetCookie(),
          },
        }
      )

    expect(status).toBe(200)
    expect(data).not.toBe(null)

    if (data) {
      expect(data.id).toBe(testProductId)
      expect(data.name).toBe('Product 1 UPDATED')
      expect(data.price).toBe('19.99')
      expect(data.stock).toBe(20)
    }
  })
})
