import { db } from '@/database/client'
import { restaurants } from '@/database/schemas/restaurants'

export const registRestaurant = async (
  contact: string,
  name: string,
  ownerId: string,
  email: string
) => {
  const repeatedRestaurant = await db.query.restaurants.findFirst({
    where: (restaurants, { eq, or }) =>
      or(eq(restaurants.contact, contact), eq(restaurants.email, email)),
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
    return { createdRestaurant: null, status: 400 }
  }

  return { createdRestaurant: createdRestaurant[0], status: 201 }
}
