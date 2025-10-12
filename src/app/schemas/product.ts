import { t } from 'elysia'

export const productSchema = t.Object({
  id: t.String({
    format: 'uuid',
  }),
  producer: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-426614174000'],
  }),
  name: t.String({
    minLength: 3,
    examples: ['Double Cheese Pizza'],
  }),
  price: t.String({
    examples: ['19.99'],
  }),
  imageUrl: t.String({
    format: 'url',
    examples: ['https://example.com/image.jpg'],
  }),
  stock: t.Number({
    examples: [20],
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
