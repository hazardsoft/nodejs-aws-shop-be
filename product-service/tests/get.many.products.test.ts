import { describe, expect, test } from 'vitest'
import mockProducts from '../src/data/products.json'
import { handler } from '../src/lambdas/getProductsList.js'

describe('Get many products test', () => {
  test('Get all products successfully', async () => {
    const response = await handler({ path: '/products' })
    const products = JSON.parse(response.body)

    expect(products).toStrictEqual(mockProducts.products)
  })
})
