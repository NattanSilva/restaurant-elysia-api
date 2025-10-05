import { retrieveRestaurant } from '@/app/functions/retrieveRestaurant'
import { updateRestaurant } from '@/app/functions/updateRestaurant'
import { db } from '@/database/client'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../pluggins/better-auth'

export const updateRestaurantRoute = new Elysia().use(betterAuthPluggin).patch(
  '/restaurants/:restaurantId',
  async ({ status, params, body, user }) => {
    const { restaurantId } = params
    const { name, contact } = body

    const { restaurant } = await retrieveRestaurant(restaurantId)

    if (!restaurant) {
      return status(404, {
        message: 'Restaurant not found.',
      })
    }

    if (user.id !== restaurant.owner) {
      return status(401, {
        message: 'You are not the owner of this restaurant.',
      })
    }

    if (name) {
      const sameNameRestaurant = await db.query.restaurants.findFirst({
        where(restaurants, { eq }) {
          return eq(restaurants.name, name)
        },
      })

      if (sameNameRestaurant) {
        return status(409, {
          message: 'This name is already in use.',
        })
      }
    }

    if (contact) {
      const sameContactRestaurant = await db.query.restaurants.findFirst({
        where(restaurants, { eq }) {
          return eq(restaurants.contact, contact)
        },
      })

      if (sameContactRestaurant) {
        return status(409, {
          message: 'This contact is already in use.',
        })
      }
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
      409: t.Object({
        message: t.String({
          examples: ['This camp is already in use.'],
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
