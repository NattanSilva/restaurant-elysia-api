import { retrieveProduct } from '@/app/functions/products/retrieveProduct'
import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import { db } from '@/database/client'
import { orders } from '@/database/schemas/orders'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const listProductOrdersRoute = new Elysia().use(betterAuthPluggin).get(
  '/orders/:productId',
  async ({ status, user, params }) => {
    const { productId } = params
    const { foundedProduct } = await retrieveProduct(productId)

    if (!foundedProduct) {
      return status(404, {
        message: 'Product not found.',
      })
    }

    const { restaurant } = await retrieveRestaurant(foundedProduct.producer)

    if (!restaurant) {
      return status(404, {
        message: 'Restaurant not found.',
      })
    }

    if (restaurant.owner !== user.id) {
      return status(401, {
        message: 'You are not the producer of this product.',
      })
    }

    const response = await db
      .select()
      .from(orders)
      .where(eq(orders.product, productId))

    return status(201, response)
  },
  {
    auth: true,
    detail: {
      tags: ['Orders'],
      description: 'List all orders of a product with owner permission',
      operationId: 'listProductOrders',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    params: t.Object({
      productId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174088'],
      }),
    }),
    response: {
      201: t.Array(
        t.Object({
          id: t.String({
            format: 'uuid',
            examples: ['123e4567-e89b-12d3-a456-426614174000'],
          }),
          client: t.String({
            format: 'uuid',
            examples: ['123e4567-e89b-12d3-a456-426614174088'],
          }),
          restaurant: t.String({
            format: 'uuid',
            examples: ['123e4567-e89b-12d3-a456-426614174075'],
          }),
          status: t.String({
            minLength: 3,
            examples: ['pending'],
          }),
          product: t.String({
            format: 'uuid',
            examples: ['123e4567-e89b-12d3-a456-4266141740a4'],
          }),
          productPrice: t.String({
            examples: ['19.99'],
          }),
          quantity: t.Number({
            examples: [2],
          }),
          totalPrice: t.String({
            examples: [`${2 * 19.99}`],
          }),
          createdAt: t.Date({
            examples: [new Date()],
          }),
          finishedAt: t.Nullable(
            t.Date({
              examples: [new Date()],
            })
          ),
        })
      ),
      400: t.Object({
        message: t.String({
          examples: ['Error in this action.'],
        }),
      }),
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
          examples: ['Internal server error.'],
        }),
      }),
    },
  }
)
