import { eq } from 'drizzle-orm'
import kleur from 'kleur'
import { auth } from './auth'
import { db } from './database/client'
import { restaurants } from './database/schemas/restaurants'
import { users } from './database/schemas/users'

export async function fakeLogin(email: string, password: string, name: string) {
  const fakeUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (fakeUser) {
    try {
      console.log(kleur.red('🗑️  Deleting fake user restaurants'))
      await db.delete(restaurants).where(eq(restaurants.owner, fakeUser.id))

      console.log(kleur.red('🗑️  Deleting fake user account'))
      await db.delete(users).where(eq(users.email, email))

      console.log(kleur.green('📦 Creating new fake user account'))
      const response = await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
          name,
          email,
          password,
        },
        method: 'POST',
      })

      return response
    } catch (error) {
      console.error(error)
    }
  }

  console.log(kleur.green('✅ Logging fake user account'))
  const response = await auth.api.signInEmail({
    returnHeaders: true,
    body: {
      email,
      password,
    },
    method: 'POST',
  })

  return response
}

export const firstUserSession = await fakeLogin(
  'JohnDoe@mail.com',
  '12345678',
  'John Doe'
)

export const secondUserSession = await fakeLogin(
  'faker@mail.com',
  '12345678',
  'Faker'
)
