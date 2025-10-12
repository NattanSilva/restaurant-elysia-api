import { listProducts } from '@/app/functions/products/listProducts'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const listAllProductsRoute = new Elysia().use(betterAuthPluggin).get(
  '/products',
  async ({ status, query }) => {
    const { producerId } = query

    const { products } = await listProducts(producerId)

    return status(200, products)
  },
  {
    auth: false,
    detail: {
      tags: ['Products'],
      description: 'List all Products',
      operationId: 'listProducts',
    },
    query: t.Object({
      producerId: t.Optional(
        t.String({
          format: 'uuid',
          examples: ['123e4567-e89b-12d3-a456-426614174000'],
        })
      ),
    }),
    response: {
      200: t.Array(
        t.Object({
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
        })
      ),
      500: t.Object({
        message: t.String({
          examples: ['Internal Server Error.'],
        }),
      }),
    },
  }
)
