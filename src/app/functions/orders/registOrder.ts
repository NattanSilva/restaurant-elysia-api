import { db } from '@/database/client'
import { orders } from '@/database/schemas/orders'
import { retrieveProduct } from '../products/retrieveProduct'
import { updateProduct } from '../products/updateProduct'
import { retrieveRestaurant } from '../retrieveRestaurant'

export const registOrder = async (
  productId: string,
  quantity: number,
  clientId: string
) => {
  const { foundedProduct } = await retrieveProduct(productId)

  if (!foundedProduct) {
    return { createdOrder: null, status: 404, camp: 'product' }
  }

  if (foundedProduct.stock < quantity) {
    return { createdOrder: null, status: 400, camp: 'stock' }
  }

  const { restaurant } = await retrieveRestaurant(foundedProduct.producer)

  if (!restaurant) {
    return { createdOrder: null, status: 404, camp: 'restaurant' }
  }

  const createdOrder = await db
    .insert(orders)
    .values({
      client: clientId,
      restaurant: foundedProduct.producer,
      status: 'pending',
      product: productId,
      productPrice: foundedProduct.price,
      quantity,
      totalPrice: `${parseFloat(foundedProduct.price) * quantity}`,
    })
    .returning()

  if (!createdOrder[0]) {
    return { createdOrder: null, status: 400, camp: 'order' }
  }

  await updateProduct({
    productId,
    data: {
      stock: foundedProduct.stock - quantity,
    },
  })

  return { createdOrder: createdOrder[0], status: 201, camp: 'order' }
}
