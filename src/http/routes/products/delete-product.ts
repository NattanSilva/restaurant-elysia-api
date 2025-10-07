import { db } from '@/database/client'
import { products } from '@/database/schemas/products'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const deleteProductRoute = new Elysia().use(betterAuthPluggin).delete(
  '/products/:productId',
  async ({ status, params, user }) => {
    const { productId } = params

    await db.delete(products).where(eq(products.id, productId))

    return status(204, void 0)
  },
  {
    auth: true,
    detail: {
      tags: ['Products'],
      description: 'List all Products',
      operationId: 'listProducts',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    params: t.Object({
      productId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    response: {
      204: t.Void(),
      500: t.Object({
        message: t.String({
          examples: ['Internal Server Error.'],
        }),
      }),
    },
  }
)
