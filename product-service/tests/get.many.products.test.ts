import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import { handler } from '@/handlers/getProductsList.js'
import { corsHeaders } from '@/helpers/response.js'

const mocks = vi.hoisted(() => {
  return {
    getProducts: vi.fn()
  }
})

vi.mock('@/repository', () => ({
  getProducts: mocks.getProducts
}))

describe('Get many products test', () => {
  test('Get all products successfully', async () => {
    mocks.getProducts.mockResolvedValueOnce(data.products)

    const response = await handler({ path: '/products' })
    const products = JSON.parse(response.body)

    expect(products).toStrictEqual(data.products)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toMatchObject(data.products)
  })

  test('Get all products fails', async () => {
    const error = new Error('Failed to get products')
    mocks.getProducts.mockRejectedValueOnce(error)

    const response = await handler({ path: '/products' })

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
  })
})
