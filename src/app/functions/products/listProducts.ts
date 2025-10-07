import { db } from '@/database/client'

export const listProducts = async (producerId?: string) => {
  if (producerId) {
    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.producer, producerId),
    })
    
    return { products }
  }
  const products = await db.query.products.findMany()

  return { products }
}
