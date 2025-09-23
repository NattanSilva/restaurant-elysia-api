import { registRestaurant } from '@/app/functions/registRestaurant'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../pluggins/better-auth'

export const createRestaurantRoute = new Elysia().use(betterAuthPluggin).post(
  '/restaurants',
  async ({ body, status, user }) => {
    const { contact, name } = body

    const { createdRestaurant } = await registRestaurant(contact, name)

    if (!createdRestaurant) {
      return status(400, {
        message: 'Error in this action.',
      })
    }

    return status(201, createdRestaurant)
  },
  {
    auth: true,
    detail: {
      tags: ['Restaurant'],
      description: 'Create a restaurant',
      operationId: 'createRestaurant',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    body: t.Object({
      name: t.String({ minLength: 3 }),
      contact: t.String({ minLength: 11, maxLength: 11 }),
    }),
    response: {
      201: t.Object({
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
          examples: ['Restaurant name has registred.'],
        }),
      }),
      401: t.Object({
        message: t.String({
          examples: ['Unauthorized.'],
        }),
      }),
    },
  }
)
