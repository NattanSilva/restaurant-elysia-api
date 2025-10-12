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
import type { ErrorValidationResponse } from '../restaurants/create-restaurant.test'

export type Product = {
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  producer: string
  price: string
  imageUrl: string
  stock: number
}

const api = treaty<typeof app>(app)
let firstUserSession: LoginRespose = {} as LoginRespose
let secondUserSession: LoginRespose = {} as LoginRespose
let restaurantId = ''
let secondRestaurantId = ''

describe('Create Product Route', () => {
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
      const { createdRestaurant, status } = await registRestaurant(
        '87999999955',
        'Second Product Test Restaurant',
        secondUserSession.response.user.id,
        secondUserSession.response.user.email
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
  })

  it('should not be able to create a new product without authentication', async () => {
    const { status, error } = await api.products.post({
      imageUrl: 'https://example.com/image.jpg',
      name: 'Double Cheese Pizza',
      price: 19.99,
      stock: 20,
      producer: restaurantId,
    })

    expect(status).toBe(401)
    expect(error).toHaveProperty('message')
  })

  it('should not be able to create a new product with wrong body', async () => {
    const { status, error } = await api.products.post({
      imageUrl: 'image.jpg',
      name: '',
      price: -10,
      stock: -20,
      producer: restaurantId,
    })

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(status).toBe(422)
    expect(responseError.value.type).toBe('validation')
    expect(responseError.value).toHaveProperty('message')
  })

  it('should not be able to create a new product with negative price', async () => {
    const { status, error } = await api.products.post(
      {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Double Cheese Pizza',
        price: -19.99,
        stock: 20,
        producer: restaurantId,
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(status).toBe(422)
    expect(responseError.value.type).toBe('validation')
    expect(responseError.value).toHaveProperty('message')
  })

  it('should not be able to create a new product with negative stock', async () => {
    const { status, error } = await api.products.post(
      {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Double Cheese Pizza',
        price: 19.99,
        stock: -20,
        producer: restaurantId,
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(status).toBe(422)
    expect(responseError.value.type).toBe('validation')
    expect(responseError.value).toHaveProperty('message')
  })

  it('should not be able to create a new product with invalid producer ID', async () => {
    const { status, error } = await api.products.post(
      {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Double Cheese Pizza',
        price: 19.99,
        stock: 20,
        producer: '123e4567-e89b-12d3-a456-4266141740A4',
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(status).toBe(404)
    expect(responseError.value).toHaveProperty('message')
  })

  it('should not be able to create a new product from other producer', async () => {
    const { status, error } = await api.products.post(
      {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Double Cheese Pizza',
        price: 19.99,
        stock: 20,
        producer: secondRestaurantId,
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    let responseError: ErrorValidationResponse =
      error as ErrorValidationResponse

    expect(status).toBe(401)
    expect(responseError.value).toHaveProperty('message')
  })

  it('should be able to create a new product', async () => {
    const { status, data } = await api.products.post(
      {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Double Cheese Pizza',
        price: 19.99,
        stock: 20,
        producer: restaurantId,
      },
      {
        headers: {
          cookie: firstUserSession.headers.getSetCookie(),
        },
      }
    )

    const product: Product = data as Product

    expect(status).toBe(201)
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('imageUrl')
    expect(product).toHaveProperty('stock')
    expect(product).toHaveProperty('producer')
    expect(product).toHaveProperty('createdAt')
    expect(product).toHaveProperty('updatedAt')
    expect(product.producer).toBe(restaurantId)
  })
})
