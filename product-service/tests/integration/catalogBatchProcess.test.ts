import { describe, expect, test, vi } from 'vitest'
import { handler } from '@/handlers/catalogBatchProcess.js'
import { getProductById } from '@/repository.js'
import { manyProductsInput, sqsEvent } from '../setup.js'

// need to mock AWS SNS client as there's no service running locally
vi.mock('@/topic.js', () => {
  return {
    sendNotification: vi.fn()
  }
})

describe('Create products in batch test', () => {
  test('should successfully create products', async () => {
    const availableProducts = await handler(sqsEvent)

    expect(availableProducts).toMatchObject(manyProductsInput)
    for await (const availableProduct of availableProducts) {
      const loadedAvailableProduct = await getProductById(availableProduct.id)
      expect(availableProduct).toStrictEqual(loadedAvailableProduct)
    }
  })
})
