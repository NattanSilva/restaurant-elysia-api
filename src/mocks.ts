import kleur from 'kleur'
import { auth } from './auth'
import { db } from './database/client'
import { accounts } from './database/schemas/accounts'
import { products } from './database/schemas/products'
import { restaurants } from './database/schemas/restaurants'
import { sessions } from './database/schemas/sessions'
import { users } from './database/schemas/users'
import { verifications } from './database/schemas/verifications'

export type LoginRespose = {
  headers: Headers
  response: {
    redirect: boolean
    token: string
    url: string | undefined
    user: {
      id: string
      email: string
      name: string
      image: string | null | undefined
      emailVerified: boolean
      createdAt: Date
      updatedAt: Date
    }
  }
}

export const cleanTestDatabase = async () => {
  try {
    console.log(kleur.red('📦 Cleaning test database'))
    await db.delete(restaurants)
    await db.delete(products)
    await db.delete(users)
    await db.delete(sessions)
    await db.delete(accounts)
    await db.delete(verifications)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export const insertUserInDatabase = async (
  email: string,
  password: string,
  name: string
) => {
  console.log(kleur.green(`📦 Creating ${name} fake user account`))
  try {
    await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        name,
        email,
        password,
      },
      method: 'POST',
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export async function fakeLogin(email: string, password: string, name: string) {
  try {
    console.log(kleur.green(`📦 Logging ${name} fake user account`))
    const response = await auth.api.signInEmail({
      returnHeaders: true,
      body: {
        email,
        password,
      },
      method: 'POST',
    })

    return response
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
