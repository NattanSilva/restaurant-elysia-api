import { listRestaurants } from '@/app/functions/listRestaurants'
import Elysia, { t } from 'elysia'

export const listAllRestaurantsRoute = new Elysia({ name: 'list-all-restaurants' }).get(
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
