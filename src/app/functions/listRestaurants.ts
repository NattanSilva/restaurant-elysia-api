import { db } from '@/database/client'

export const listRestaurants = async (ownerId?: string) => {
  if (ownerId) {
    const restaurants = await db.query.restaurants.findMany({
      where: (restaurants, { eq }) => eq(restaurants.owner, ownerId),
    })

    return { restaurants }
  }

  const restaurants = await db.query.restaurants.findMany()

  return { restaurants }
}
