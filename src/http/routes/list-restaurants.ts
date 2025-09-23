import { listRestaurants } from '@/app/functions/listRestaurants'
import Elysia, { t } from 'elysia'

export const listAllRestaurantsRoute = new Elysia().get(
  '/restaurants',
  async ({ status }) => {
    const { restaurants } = await listRestaurants()

    return status(200, restaurants)
  },
  {
    auth: false,
    detail: {
      tags: ['Restaurant'],
      description: 'List all restaurants',
      operationId: 'listAllRestaurants',
    },
    response: {
      200: t.Array(
        t.Object({
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
        })
      ),
      500: t.Object({
        message: t.String({
          examples: ['Internal server error.'],
        }),
      }),
    },
  }
)
