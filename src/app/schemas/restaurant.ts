import { t } from 'elysia'

export const restaurantSchema = t.Object({
  id: t.String({
    format: 'uuid',
  }),
  name: t.String({
    examples: ["John's Pizza"],
  }),
  contact: t.String({
    examples: ['87999999999'],
  }),
  owner: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-426614174000'],
  }),
  createdAt: t.String({
    default: 'Generated at runtime',
    examples: [new Date().toISOString()],
  }),
  updatedAt: t.String({
    default: 'Generated at runtime',
    examples: [new Date().toISOString()],
  }),
})
