import { randomUUIDv7 } from 'bun'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'


export const restaurants = pgTable('restaurants', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  owner: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  email: text('email').notNull(),
  name: text('name').notNull().unique(),
  contact: text().notNull().unique(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})
