import { db } from '@/database/client'
import { products } from '@/database/schemas/products'

export const registProduct = async ({
  name,
  producer,
  price,
  imageUrl,
  stock,
}: {
  name: string
  producer: string
  price: string
  imageUrl: string
  stock: number
}) => {
  const createdProduct = await db
    .insert(products)
    .values({
      name,
      producer,
      price,
      imageUrl,
      stock,
    })
    .returning()

  return {
    createdProduct: createdProduct[0],
    status: 201,
  }
}
