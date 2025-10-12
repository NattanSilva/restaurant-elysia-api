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
let restaurantId = ''
let testProductId = ''

describe('Delete Product Route', () => {
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

      restaurantId = createdRestaurant.id
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

    try {
      const { createdProduct } = await registProduct({
        name: 'Product Test',
        imageUrl: 'https://example.com/image.jpg',
        price: 19.99 + '',
        stock: 20,
        producer: restaurantId,
      })

      testProductId = createdProduct.id
    } catch (error) {}
  })

  it('sould not be able to delete a product with invalid type id', async () => {
    const { status } = await api
      .products({
        productId: '123e4567',
      })
      .delete({
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      })

    expect(status).toBe(422)
  })

  it('sould not be able to delete a product with invalid id', async () => {
    const { status, error } = await api
      .products({
        productId: '123e4567-e89b-12d3-a456-426614174025',
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

  it('sould not be able to delete a product without authentication', async () => {
    const { status, error } = await api
      .products({
        productId: '123e4567-e89b-12d3-a456-426614174025',
      })
      .delete({}, {})

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('sould not be able to delete a product without to be the producer', async () => {
    const { status, error } = await api
      .products({
        productId: testProductId,
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

  it('sould be able to delete a product', async () => {
    const { status, error } = await api
      .products({
        productId: testProductId,
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
