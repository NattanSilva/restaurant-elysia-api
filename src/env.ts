import z from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3333'),
  DATABASE_URL: z.url().startsWith('postgres://', {
    error: "DATABASE_URL no .env deve começar com 'postgres://'",
  }),
  TEST_DATABASE_URL: z.url().startsWith('postgres://', {
    error: "TEST_DATABASE_URL no .env deve começar com 'postgres://'",
  }),
  SERVER_TYPE_RUNNER: z
    .enum(['test', 'dev', 'prod'], {
      error: "SERVER_TYPE_RUNNER no .env deve ser 'test', 'dev' ou 'prod'",
    })
    .default('dev'),
})

export const env: z.infer<typeof envSchema> = envSchema.parse(Bun.env)
