import { deleteRestaurant } from '@/app/functions/deleteRestaurant'
import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../pluggins/better-auth'

export const deleteRestaurantRoute = new Elysia().use(betterAuthPluggin).delete(
  '/restaurants/:restaurantId',
  async ({ status, params, user }) => {
    const { restaurantId } = params

    const { restaurant } = await retrieveRestaurant(restaurantId)

    if (!restaurant) {
      return status(404, {
        message: 'Restaurant not found.',
      })
    }

    if (user.id !== restaurant?.owner) {
      return status(401, {
        message: 'You are not the owner of this restaurant.',
      })
    }

    await deleteRestaurant(restaurantId)

    return status(204, void 0)
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
    response: {
      204: t.Void(),
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
