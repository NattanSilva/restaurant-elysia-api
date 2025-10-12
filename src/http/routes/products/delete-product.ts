import { retrieveProduct } from '@/app/functions/products/retrieveProduct'
import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import { db } from '@/database/client'
import { products } from '@/database/schemas/products'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const deleteProductRoute = new Elysia().use(betterAuthPluggin).delete(
  '/products/:productId',
  async ({ status, params, user }) => {
    const { productId } = params

    const { foundedProduct } = await retrieveProduct(productId)

    if (!foundedProduct) {
      return status(404, {
        message: 'Product not found.',
      })
    }

    const { restaurant: productOwner } = await retrieveRestaurant(
      foundedProduct.producer
    )

    if (!productOwner || user.id !== productOwner.owner) {
      return status(401, {
        message: 'You are not the producer of this product.',
      })
    }

    await db.delete(products).where(eq(products.id, productId))

    return status(204, void 0)
  },
  {
    auth: true,
    detail: {
      tags: ['Products'],
      description: 'Delete a Product',
      operationId: 'deleteProduct',
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
      401: t.Object({
        message: t.String({
          examples: ['Unauthorized.'],
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
