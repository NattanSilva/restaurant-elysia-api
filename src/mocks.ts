import { eq } from 'drizzle-orm'
import kleur from 'kleur'
import { auth } from './auth'
import { db } from './database/client'
import { restaurants } from './database/schemas/restaurants'
import { users } from './database/schemas/users'

export async function fakeLogin() {
  const fakeUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'faker@mail.com'),
  })

  if (fakeUser) {
    console.log(kleur.red('🗑️  Deleting fake user restaurants'))
    await db.delete(restaurants).where(eq(restaurants.owner, fakeUser.id))

    console.log(kleur.red('🗑️  Deleting fake user account'))
    await db.delete(users).where(eq(users.email, 'faker@mail.com'))

    console.log(kleur.green('📦 Creating new fake user account'))
    const response = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        name: 'Faker',
        email: 'faker@mail.com',
        password: '12345678',
      },
      method: 'POST',
    })

    return response
  }

  console.log(kleur.green('✅ Logging fake user account'))
  const response = await auth.api.signUpEmail({
    returnHeaders: true,
    body: {
      name: 'Faker',
      email: 'faker@mail.com',
      password: '12345678',
    },
    method: 'POST',
  })

  return response
}
