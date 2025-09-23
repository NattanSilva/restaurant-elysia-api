import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'

export const registRestaurant = async (contact: string, name: string) => {
  const createdRestaurant = await db
    .insert(restaurants)
    .values({
      contact,
      name,
    })
    .returning()

  if (!createdRestaurant[0]) {
    return { createdRestaurant: null }
  }

  return { createdRestaurant: createdRestaurant[0] }
}
