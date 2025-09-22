import { auth } from '@/auth'
import cors from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia, t } from 'elysia'
import { betterAuthPluggin, OpenAPI } from '../http/pluggins/better-auth'

export const app = new Elysia().use(betterAuthPluggin)

// OPEN API Documentation
app.use(
  openapi({
    documentation: {
      info: {
        title: 'Restaurant API Documentation',
        description: 'API documentation for the Restaurant Management System',
        version: '1.0.0',
      },
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
    exclude: {
      methods: ['OPTIONS'],
    },
  })
)

// Routes
app.get(
  '/',
  () => ({
    Hello: 'Elysia',
  }),
  {
    detail: {
      description: 'Get a "Hello World" message',
      tags: ['Hello World'],
    },
    response: {
      200: t.Object({
        Hello: t.String({
          examples: ['Elysia'],
        }),
      }),
    },
  }
)

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflight: false,
  })
)
