import { registOrder } from '@/app/functions/orders/registOrder'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const createOrderRoute = new Elysia().use(betterAuthPluggin).post(
  '/orders',
  async ({ body, status, user }) => {
    const { product, quantity } = body

    const {
      createdOrder,
      status: creationStatus,
      camp,
    } = await registOrder(product, quantity, user.id)

    if (!createdOrder) {
      if (creationStatus === 404) {
        return status(404, {
          message: `${camp} not found.`,
        })
      }

      if (camp === 'stock') {
        return status(400, {
          message: 'This product has not enough stock.',
        })
      }

      return status(400, {
        message: 'Error in this action.',
      })
    }

    return status(201, createdOrder)
  },
  {
    auth: true,
    detail: {
      tags: ['Orders'],
      description: 'Create a Order',
      operationId: 'createOrder',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    body: t.Object({
      product: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
      quantity: t.Integer({
        minimum: 1,
        examples: [2],
      }),
    }),
    response: {
      201: t.Object({
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
      }),
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
