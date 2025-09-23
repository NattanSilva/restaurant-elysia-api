import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import { updateRestaurant } from '@/app/functions/updateRestaurant'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../pluggins/better-auth'

export const updateRestaurantRoute = new Elysia().use(betterAuthPluggin).patch(
  '/restaurants/:restaurantId',
  async ({ status, params, body }) => {
    const { restaurantId } = params
    const { name, contact } = body

    const currentRestaurant = await retrieveRestaurant(restaurantId)

    if (!currentRestaurant) {
      return status(404, {
        message: 'Restaurant not found.',
      })
    }

    const { updatedRestaurant } = await updateRestaurant({
      restaurantId,
      name,
      contact,
    })

    return status(200, updatedRestaurant)
  },
  {
    auth: true,
    detail: {
      tags: ['Restaurant'],
      description: 'Update a restaurant',
      operationId: 'updateRestaurant',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    params: t.Object({
      restaurantId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 3, examples: ["Jho's Pizza"] })),
      contact: t.Optional(
        t.String({ minLength: 11, maxLength: 11, examples: ['87999999999'] })
      ),
    }),
    response: {
      200: t.Object({
        name: t.String({
          examples: ["John's Pizza"],
        }),
        contact: t.String({
          examples: ['87999999999'],
        }),
        id: t.String({
          format: 'uuid',
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
          examples: ['Error in this action.'],
        }),
      }),
      404: t.Object({
        message: t.String({
          examples: ['Restaurant not found.'],
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
