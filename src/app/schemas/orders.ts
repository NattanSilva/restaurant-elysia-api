import { t } from 'elysia'

export const orderSchema = t.Object({
  id: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-426614174000'],
  }),
  client: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-426614174088'],
  }),
  restaurant: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-426614174075'],
  }),
  status: t.String({
    minLength: 3,
    examples: ['pending'],
  }),
  product: t.String({
    format: 'uuid',
    examples: ['123e4567-e89b-12d3-a456-4266141740a4'],
  }),
  productPrice: t.String({
    examples: ['19.99'],
  }),
  quantity: t.Number({
    examples: [2],
  }),
  totalPrice: t.String({
    examples: [`${2 * 19.99}`],
  }),
  createdAt: t.String({
    default: 'Generated at runtime',
    examples: [new Date().toISOString()],
  }),
  finishedAt: t.Nullable(
    t.String({
      default: null,
      examples: [new Date().toISOString()],
    })
  ),
})
