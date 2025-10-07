import { randomUUIDv7 } from 'bun'
import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { restaurants } from './restaurants'

export const products = pgTable('products', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  producer: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull().unique(),
  price: decimal('price').notNull(),
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})
