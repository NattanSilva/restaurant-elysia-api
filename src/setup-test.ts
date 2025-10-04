import { beforeAll } from 'bun:test'
import { cleanTestDatabase, insertUserInDatabase } from './mocks'

beforeAll(async () => {
  await cleanTestDatabase()

  await insertUserInDatabase('JohnDoe@mail.com', '12345678', 'John Doe')
  await insertUserInDatabase('faker@mail.com', '12345678', 'Faker')
})
