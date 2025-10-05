import { db } from '@/database/client'

export const retrieveRestaurant = async (id: string) => {
  const restaurant = await db.query.restaurants.findFirst({
    where: (restaurants, { eq }) => eq(restaurants.id, id),
  })

  return { restaurant }
}
