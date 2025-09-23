import { db } from '@/database/client'

export const listRestaurants = async () => {
  const restaurants = await db.query.restaurants.findMany()

  return { restaurants }
}
