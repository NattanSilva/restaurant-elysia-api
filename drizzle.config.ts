import { env } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/database/schemas/**',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      env.SERVER_TYPE_RUNNER !== 'test'
        ? env.DATABASE_URL
        : env.TEST_DATABASE_URL,
  },
  casing: 'snake_case',
})
