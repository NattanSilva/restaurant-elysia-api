import { restaurantSchema } from '@/app/schemas/restaurant'
import cors from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { betterAuthPluggin, OpenAPI } from '../http/pluggins/better-auth'
import { createRestaurantRoute } from './routes/create-restaurant'
import { deleteRestaurantRoute } from './routes/delete-restaurant'
import { listAllRestaurantsRoute } from './routes/list-restaurants'
import { retrieveRestaurantRoute } from './routes/retrieve-restaurant'
import { updateRestaurantRoute } from './routes/update-restaurant'

const components = {
  ...(await OpenAPI.components),
  schemas: {
    ...(await OpenAPI.components).schemas,
    Restaurant: restaurantSchema,
  },
}

export const app = new Elysia()
  .use(betterAuthPluggin)
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Restaurant API Documentation',
          description: 'API documentation for the Restaurant Management System',
          version: '1.0.0',
        },
        components,
        paths: await OpenAPI.getPaths(),
      },
      exclude: {
        methods: ['OPTIONS'],
      },
    })
  )
  .use(createRestaurantRoute)
  .use(listAllRestaurantsRoute)
  .use(retrieveRestaurantRoute)
  .use(updateRestaurantRoute)
  .use(deleteRestaurantRoute)
  .use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      preflight: false,
    })
  )
  .compile()
