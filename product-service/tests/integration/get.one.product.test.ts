import { describe, expect, test } from 'vitest'
import { handler as getProducts } from '@/handlers/getProductsList.js'
import { handler as getOneProduct } from '@/handlers/getProductsById.js'
import { ProductNotFound } from '@/errors.js'
import { v4 as uuidv4 } from 'uuid'
import type { AvailableProduct } from '@/types'

describe('Get one product test', () => {
  test('Get one product successfully', async () => {
    const responseAllProducts = await getProducts({ path: '/products' })
    const products: AvailableProduct[] = JSON.parse(responseAllProducts.body)
    const oneProduct = products[0] as AvailableProduct

    const response = await getOneProduct({ pathParameters: { id: oneProduct.id } })
    const product = JSON.parse(response.body)

    expect(product).toEqual(oneProduct)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toMatchObject(oneProduct)
  })

  test('Get one product returns 404', async () => {
    const nonExistingProductId = uuidv4()
    const error = new ProductNotFound(nonExistingProductId)

    const response = await getOneProduct({ pathParameters: { id: nonExistingProductId } })

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
  })
})
