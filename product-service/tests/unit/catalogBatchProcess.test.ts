import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import { handler } from '@/handlers/catalogBatchProcess.js'

import { ProductCreationFail } from '@/errors.js'
import { config, manyProductsInput, sqsEvent } from '../setup.js'
import { getEmail } from '@/helpers/email.js'

const mocks = vi.hoisted(() => {
  return {
    createProductsInBatch: vi.fn(),
    sendNotification: vi.fn()
  }
})

vi.mock('@/repository.js', () => {
  return {
    createProductsInBatch: mocks.createProductsInBatch
  }
})
vi.mock('@/topic.js', () => {
  return {
    sendNotification: mocks.sendNotification
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

    const notification = getEmail(availableProducts)
    expect(mocks.sendNotification).toHaveBeenCalledOnce()
    expect(mocks.sendNotification).toHaveBeenCalledWith(
      config.topicArn,
      notification.subject,
      notification.body
    )
    expect(mocks.sendNotification).toHaveReturned()
  })

  test('should return empty array of available products if creation fails', async () => {
    mocks.createProductsInBatch.mockRejectedValueOnce(new ProductCreationFail())

    const availableProducts = await handler(sqsEvent)
    expect(availableProducts.length).toBe(0)
    expect(mocks.createProductsInBatch).toHaveBeenCalledOnce()
    expect(mocks.createProductsInBatch).toHaveBeenCalledWith(manyProductsInput)

    expect(mocks.sendNotification).not.toHaveBeenCalled()
  })
})
