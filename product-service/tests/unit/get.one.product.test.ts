import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import type { Product } from '@/types.js'
import { handler } from '@/handlers/getProductsById.js'
import { ProductInvalidId, ProductNotFound } from '@/errors.js'

const mockProduct = data.products[0] as Product

const mocks = vi.hoisted(() => {
  return {
    getProductById: vi.fn()
  }
})

vi.mock('@/repository', () => ({
  getProductById: mocks.getProductById
}))

describe('Get one product test', () => {
  test('Get one product successfully', async () => {
    mocks.getProductById.mockResolvedValueOnce(mockProduct)

    const response = await handler({ pathParameters: { id: mockProduct.id } })
    const product = JSON.parse(response.body)

    expect(product).toEqual(mockProduct)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toMatchObject(mockProduct)
    expect(mocks.getProductById).toHaveBeenCalledOnce()
  })

  test('Get one product returns 400 (space)', async () => {
    const productId = '%20'
    const error = new ProductInvalidId(productId)
    const response = await handler({ pathParameters: { id: productId } })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
    expect(mocks.getProductById).not.toHaveBeenCalled()
  })

  test('Get one product returns 400 (undefined)', async () => {
    const productId = undefined
    const error = new ProductInvalidId(productId)
    const response = await handler({ pathParameters: { id: productId } })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
    expect(mocks.getProductById).not.toHaveBeenCalled()
  })

  test('Get one product returns 404', async () => {
    const productId = 'invalid-product-id'
    const error = new ProductNotFound(productId)
    mocks.getProductById.mockRejectedValueOnce(error)
    const response = await handler({ pathParameters: { id: productId } })

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
    expect(mocks.getProductById).toHaveBeenCalledOnce()
  })

  test('Get one product fails', async () => {
    const error = new Error('Failed to get product by id')
    mocks.getProductById.mockRejectedValueOnce(error)
    const response = await handler({ pathParameters: { id: mockProduct.id } })

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
  })
})
