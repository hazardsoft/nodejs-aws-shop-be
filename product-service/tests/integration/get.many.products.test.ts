import { describe, expect, test } from 'vitest'
import { handler } from '@/handlers/getProductsList.js'
import { ProductSchema, type AvailableProduct } from '@/types'

describe('Get many products test', () => {
  test('Get all products successfully', async () => {
    const response = await handler({ path: '/products' })
    const products: AvailableProduct[] = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(products).toBeInstanceOf(Array)
    expect(products.length).toBeGreaterThan(0)
    products.forEach((product) => {
      expect(ProductSchema.safeParse(product).success).toBe(true)
    })
  })
})
