import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { schema } from './schemas'

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'snake_case',
})
