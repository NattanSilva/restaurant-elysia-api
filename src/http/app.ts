import { productSchema } from '@/app/schemas/product'
import { restaurantSchema } from '@/app/schemas/restaurant'
import cors from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { betterAuthPluggin, OpenAPI } from '../http/pluggins/better-auth'
import { createProductRoute } from './routes/products/create-product'
import { deleteProductRoute } from './routes/products/delete-product'
import { listAllProductsRoute } from './routes/products/list-products'
import { retrieveProductRoute } from './routes/products/retrieve-product'
import { updateProductRoute } from './routes/products/update-product'
import { createRestaurantRoute } from './routes/restaurants/create-restaurant'
import { deleteRestaurantRoute } from './routes/restaurants/delete-restaurant'
import { listAllRestaurantsRoute } from './routes/restaurants/list-restaurants'
import { retrieveRestaurantRoute } from './routes/restaurants/retrieve-restaurant'
import { updateRestaurantRoute } from './routes/restaurants/update-restaurant'

const components = {
  ...(await OpenAPI.components),
  schemas: {
    ...(await OpenAPI.components).schemas,
    Restaurant: restaurantSchema,
    Product: productSchema,
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
  .use(createProductRoute)
  .use(listAllProductsRoute)
  .use(retrieveProductRoute)
  .use(updateProductRoute)
  .use(deleteProductRoute)
  .use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      preflight: false,
    })
  )
  .compile()
