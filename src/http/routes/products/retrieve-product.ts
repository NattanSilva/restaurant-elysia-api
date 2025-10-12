import { retrieveProduct } from '@/app/functions/products/retrieveProduct'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const retrieveProductRoute = new Elysia().use(betterAuthPluggin).get(
  '/products/:productId',
  async ({ status, params }) => {
    const { productId } = params
    const { foundedProduct } = await retrieveProduct(productId)

    if (!foundedProduct) {
      return status(404, {
        message: 'Product not found.',
      })
    }

    return status(200, foundedProduct)
  },
  {
    auth: false,
    detail: {
      tags: ['Products'],
      description: 'Retrieve a Product',
      operationId: 'retrieveProduct',
    },
    params: t.Object({
      productId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    response: {
      200: t.Object({
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
      404: t.Object({
        message: t.String({
          examples: ['Product not found.'],
        }),
      }),
      500: t.Object({
        message: t.String({
          examples: ['Internal Server Error.'],
        }),
      }),
    },
  }
)
