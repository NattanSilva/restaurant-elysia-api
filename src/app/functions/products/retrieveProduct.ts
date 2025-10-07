import { db } from '@/database/client'

export const retrieveProduct = async (productId: string) => {
  const foundedProduct = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, productId),
  })

  return { foundedProduct }
}
