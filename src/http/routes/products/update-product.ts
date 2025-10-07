import { updateProduct } from '@/app/functions/products/updateProduct'
import { db } from '@/database/client'
import Elysia, { t } from 'elysia'
import { betterAuthPluggin } from '../../pluggins/better-auth'

export const updateProductRoute = new Elysia().use(betterAuthPluggin).patch(
  '/products/:productId',
  async ({ status, params, user, body }) => {
    const { productId } = params
    const { name, price, imageUrl, stock } = body

    const currentProduct = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, productId),
    })

    if (!currentProduct) {
      return status(404, {
        message: 'Product not found.',
      })
    }

    const { updatedProduct } = await updateProduct({
      productId,
      data: {
        name,
        price: `${price}`,
        imageUrl,
        stock,
      },
    })

    return status(200, updatedProduct)
  },
  {
    auth: true,
    detail: {
      tags: ['Products'],
      description: 'List all Products',
      operationId: 'listProducts',
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    params: t.Object({
      productId: t.String({
        format: 'uuid',
        examples: ['123e4567-e89b-12d3-a456-426614174000'],
      }),
    }),
    body: t.Object({
      name: t.Optional(
        t.String({
          minLength: 3,
          examples: ['Double Cheese Pizza'],
        })
      ),
      price: t.Optional(
        t.Number({
          minimum: 1,
          examples: [19.99],
        })
      ),
      imageUrl: t.Optional(
        t.String({
          format: 'url',
          examples: ['https://example.com/image.jpg'],
        })
      ),
      stock: t.Optional(
        t.Integer({
          minimum: 1,
          examples: [20],
        })
      ),
    }),
    response: {
      200: t.Object({
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
        createdAt: t.Date({
          examples: [new Date()],
        }),
        updatedAt: t.Date({
          examples: [new Date()],
        }),
      }),
      404: t.Object({
        message: t.String({
          examples: ['Product not found.'],
        }),
      }),
      500: t.Object({
        message: t.String({
          examples: ['Internal Server Error.'],
        }),
      }),
    },
  }
)
