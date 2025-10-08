import { registRestaurant } from '@/app/functions/registRestaurant'
import { db } from '@/database/client'
import { app } from '@/http/app'
import { fakeLogin, type LoginRespose } from '@/mocks'
import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import type { ErrorValidationResponse } from '../restaurants/create-restaurant.test'

type Product = {
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

beforeAll(async () => {
  firstUserSession = await fakeLogin('JohnDoe@mail.com', '12345678', 'John Doe')
  secondUserSession = await fakeLogin('faker@mail.com', '12345678', 'Faker')

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
})

describe('Create Product Route', () => {
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
      stock: 20,
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

  it('should be able to create a new product', async () => {
    console.log(restaurantId)
    const findedRestaurant = await db.query.restaurants.findFirst({
      where: (restautant, { eq }) => eq(restautant.id, restaurantId),
    })

    console.log(findedRestaurant)

    const { status, data, error } = await api.products.post(
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

    console.log(error?.value)

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
    expect(product.producer).toBe(firstUserSession.response.user.id)
  })
})
