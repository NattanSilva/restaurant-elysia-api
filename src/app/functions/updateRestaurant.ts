import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'
import { eq } from 'drizzle-orm'

export const updateRestaurant = async ({
  restaurantId,
  name,
  contact,
}: {
  restaurantId: string
  name?: string
  contact?: string
}) => {
  const updatedRestaurant = await db
    .update(restaurants)
    .set({
      name,
      contact,
    })
    .where(eq(restaurants.id, restaurantId))
    .returning()

  return { updatedRestaurant: updatedRestaurant[0] }
}
