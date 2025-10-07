import { registProduct } from '@/app/functions/products/registProduct'
import { db } from '@/database/client'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const createProductRoute = new Elysia().use(betterAuthPluggin).post(
  '/products',
  async ({ body, status, user }) => {
    const { imageUrl, name, price, stock, producer } = body

    const producerExists = await db.query.restaurants.findFirst({
      where: (restaurants, { eq }) => eq(restaurants.id, producer),
    })

    if (!producerExists) {
      return status(404, {
        message: 'Producer not found.',
      })
    }

    if (producerExists.owner !== user.id) {
      return status(401, {
        message: 'You are not the owner of this restaurant.',
      })
    }

    const { createdProduct } = await registProduct({
      imageUrl,
      name,
      price: `${price}`,
      stock,
      producer,
    })

    return status(201, createdProduct)
  },
  {
    auth: true,
    detail: {
      tags: ['Products'],
      description: 'Create a Product',
      operationId: 'createProduct',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    body: t.Object({
      name: t.String({
        minLength: 3,
        examples: ['Double Cheese Pizza'],
      }),
      price: t.Number({
        minimum: 1,
        examples: [19.99],
      }),
      imageUrl: t.String({
        format: 'url',
        examples: ['https://example.com/image.jpg'],
      }),
      stock: t.Integer({
        minimum: 1,
        examples: [20],
      }),
      producer: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    response: {
      201: t.Object({
        id: t.String({
          format: 'uuid',
        }),
        producer: t.String({
          format: 'uuid',
          examples: ['123e4567-e89b-12d3-a456-426614174000'],
        }),
        name: t.String({
          minLength: 3,
          examples: ['Double Cheese Pizza'],
        }),
        price: t.String({
          examples: ['19.99'],
        }),
        imageUrl: t.String({
          format: 'url',
          examples: ['https://example.com/image.jpg'],
        }),
        stock: t.Number({
          examples: [20],
        }),
        createdAt: t.Date({
          examples: [new Date()],
        }),
        updatedAt: t.Date({
          examples: [new Date()],
        }),
      }),
      400: t.Object({
        message: t.String({
          examples: ['Product name has registred.'],
        }),
      }),
      401: t.Object({
        message: t.String({
          examples: ['Unauthorized.'],
        }),
      }),
      404: t.Object({
        message: t.String({
          examples: ['Producer not found.'],
        }),
      }),
      409: t.Object({
        message: t.String({
          examples: ['Product already exists.'],
        }),
      }),
    },
  }
)
