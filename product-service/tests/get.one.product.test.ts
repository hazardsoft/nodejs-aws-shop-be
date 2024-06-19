import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import type { Product, ProductError } from '@/types.js'
import { handler } from '@/handlers/getProductsById.js'
import { corsHeaders } from '@/helpers/response.js'
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
    expect(response.headers).toMatchObject(corsHeaders)
    expect(JSON.parse(response.body)).toMatchObject(mockProduct)
    expect(mocks.getProductById).toHaveBeenCalledOnce()
  })

  test('Get one product returns 400', async () => {
    const emptyProductId = '%20'
    const response = await handler({ pathParameters: { id: emptyProductId } })
    const error: ProductError = {
      message: new ProductInvalidId().message
    }

    expect(response.statusCode).toBe(400)
    expect(response.headers).toMatchObject(corsHeaders)
    expect(JSON.parse(response.body)).toMatchObject(error)
    expect(mocks.getProductById).not.toHaveBeenCalled()
  })

  test('Get one product returns 400 (2nd case)', async () => {
    const response = await handler({ pathParameters: { id: undefined } })
    const error: ProductError = {
      message: new ProductInvalidId().message
    }

    expect(response.statusCode).toBe(400)
    expect(response.headers).toMatchObject(corsHeaders)
    expect(JSON.parse(response.body)).toMatchObject(error)
    expect(mocks.getProductById).not.toHaveBeenCalled()
  })

  test('Get one product returns 404', async () => {
    const invalidProductId = 'invalid-product-id'
    const error = new ProductNotFound(invalidProductId)
    mocks.getProductById.mockRejectedValueOnce(error)

    const response = await handler({ pathParameters: { id: invalidProductId } })

    expect(response.statusCode).toBe(404)
    expect(response.headers).toMatchObject(corsHeaders)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message } as ProductError)
    expect(mocks.getProductById).toHaveBeenCalledOnce()
  })
})
