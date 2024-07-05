import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import { handler } from '@/handlers/catalogBatchProcess.js'

import { ProductCreationFail } from '@/errors.js'
import { manyProductsInput, sqsEvent } from '../setup.js'

const mocks = vi.hoisted(() => {
  return {
    createProductsInBatch: vi.fn()
  }
})

vi.mock('@/repository.js', () => {
  return {
    createProductsInBatch: mocks.createProductsInBatch
  }
})

describe('catalogBatchProcess handler tests', () => {
  test('should return available products', async () => {
    mocks.createProductsInBatch.mockResolvedValueOnce(data.products)

    const availableProducts = await handler(sqsEvent)
    expect(availableProducts).toMatchObject(data.products)
    expect(availableProducts.length).toBe(data.products.length)
    expect(mocks.createProductsInBatch).toHaveBeenCalledOnce()
    expect(mocks.createProductsInBatch).toHaveBeenCalledWith(manyProductsInput)
    expect(mocks.createProductsInBatch).toHaveReturned()
  })

  test('should return empty array of available products if creation fails', async () => {
    mocks.createProductsInBatch.mockRejectedValueOnce(new ProductCreationFail())

    const availableProducts = await handler(sqsEvent)
    expect(availableProducts.length).toBe(0)
    expect(mocks.createProductsInBatch).toHaveBeenCalledOnce()
    expect(mocks.createProductsInBatch).toHaveBeenCalledWith(manyProductsInput)
  })
})
