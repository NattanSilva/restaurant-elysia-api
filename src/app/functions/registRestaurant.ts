import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'

export const registRestaurant = async (
  contact: string,
  name: string,
  ownerId: string,
  email: string
) => {
  const repeatedRestaurant = await db.query.restaurants.findFirst({
    where: (restaurants, { eq }) =>
      eq(restaurants.contact, contact) || eq(restaurants.name, name),
  })

  if (repeatedRestaurant) {
    return { createdRestaurant: null, status: 409 }
  }

  const createdRestaurant = await db
    .insert(restaurants)
    .values({
      contact,
      name,
      email,
      owner: ownerId,
    })
    .returning()

  if (!createdRestaurant[0]) {
    return { createdRestaurant: null }
  }

  return { createdRestaurant: createdRestaurant[0], status: 201 }
}
