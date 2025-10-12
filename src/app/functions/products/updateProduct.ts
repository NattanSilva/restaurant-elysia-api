import { db } from '@/database/client'
import { products } from '@/database/schemas/products'
import { eq } from 'drizzle-orm'

export const updateProduct = async ({
  productId,
  data,
}: {
  productId: string
  data: {
    name?: string
    price?: string
    imageUrl?: string
    stock?: number
  }
}) => {
  const { name, price, imageUrl, stock } = data
  const updatedProduct = await db
    .update(products)
    .set({
      name,
      price,
      imageUrl,
      stock,
    })
    .where(eq(products.id, productId))
    .returning()

  return {
    updatedProduct: updatedProduct[0],
    status: 200,
  }
}
