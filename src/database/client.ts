import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { schema } from './schemas'

export const db = drizzle(
  env.SERVER_TYPE_RUNNER !== 'test' ? env.DATABASE_URL : env.TEST_DATABASE_URL,
  {
    schema,
  }
)
