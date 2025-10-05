import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'
import { eq } from 'drizzle-orm'

export const deleteRestaurant = async (restaurantId: string) => {
  await db.delete(restaurants).where(eq(restaurants.id, restaurantId))
}
