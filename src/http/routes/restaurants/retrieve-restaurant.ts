import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import Elysia, { t } from 'elysia'

export const retrieveRestaurantRoute = new Elysia({
  name: 'retrieve-restaurant',
}).get(
  '/restaurants/:restaurantId',
  async ({ status, params }) => {
    const { restaurantId } = params
    const { restaurant } = await retrieveRestaurant(restaurantId)

    if (!restaurant) {
      return status(404, {
        message: 'Restaurant not found.',
      })
    }

    return status(200, restaurant)
  },
  {
    auth: false,
    detail: {
      tags: ['Restaurant'],
      description: 'Retrieve a restaurant',
      operationId: 'retrieveRestaurant',
    },
    params: t.Object({
      restaurantId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    response: {
      200: t.Object({
        id: t.String({
          format: 'uuid',
        }),
        name: t.String({
          examples: ["John's Pizza"],
        }),
        contact: t.String({
          examples: ['87999999999'],
        }),
        owner: t.String({
          format: 'uuid',
          examples: ['123e4567-e89b-12d3-a456-426614174000'],
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
