import { randomUUIDv7 } from 'bun'
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { products } from './products'
import { restaurants } from './restaurants'
import { users } from './users'

export const statusEnum = pgEnum('roles', [
  'pending',
  'approved',
  'completed',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  client: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  restaurant: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'restrict' }),
  status: statusEnum('status').default('pending').notNull(),
  product: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'restrict' }),
  productPrice: decimal('product_price').notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: decimal('total_price').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  finishedAt: timestamp('finished_at'),
})
