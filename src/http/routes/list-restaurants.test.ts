import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'
import { app } from '../app'

const api = treaty<typeof app>(app)

describe('List Restaurants Route', () => {
  it('sould be able to list all restaurants', async () => {
    const { status, data } = await api.restaurants.get()

    expect(status).toBe(200)
    expect(data).not.toBe(null)
    expect(data).toBeInstanceOf(Array)
  })
})
