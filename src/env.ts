import z from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3333'),
  DATABASE_URL: z.url().startsWith('postgres://'),
})

export const env: z.infer<typeof envSchema> = envSchema.parse(Bun.env)
