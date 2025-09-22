import { db } from '../../database/client'

export const findUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  })

  if (!user) {
    return { user: null }
  }

  return { user }
}
