import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from './database/client'
import { schema } from './database/schemas'

export const auth = betterAuth({
  basePath: '/auth',
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: { ...schema },
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  logger: {
    level: 'debug',
    disabled: false,
    log(level, message, ...args) {
      console.log(message)
    },
  },
})
