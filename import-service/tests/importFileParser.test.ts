import { describe, expect, test, vi } from 'vitest'
import { handler, type S3Event } from '@/handlers/importFileParser.js'
import { config, getProductsInput, getProductsStream } from './setup.js'
import { FailedToReadObject } from '@/errors.js'

const mocks = vi.hoisted(() => {
  return {
    s3: {
      readObject: vi.fn(),
      copyObject: vi.fn(),
      deleteObject: vi.fn()
    },
    sqs: {
      sendMessage: vi.fn(),
      sendMessagesInBatch: vi.fn()
    }
  }
})

vi.mock('@/helpers/bucket.js', () => ({
  readObject: mocks.s3.readObject,
  copyObject: mocks.s3.copyObject,
  deleteObject: mocks.s3.deleteObject
}))

vi.mock('@/helpers/queue.js', () => ({
  sendMessage: mocks.sqs.sendMessage,
  sendMessagesInBatch: mocks.sqs.sendMessagesInBatch
}))

describe('Parse products CSV', () => {
  const key = `uploaded/${config.fileName}`
  const event: S3Event = {
    Records: [
      {
        s3: {
          bucket: { name: config.bucketName },
          object: { key }
        }
      }
    ]
  }

  test('should parse products CSV', async () => {
    mocks.s3.readObject.mockResolvedValueOnce(getProductsStream())

    await handler(event)

    expect(mocks.s3.readObject).toHaveBeenCalledOnce()
    expect(mocks.s3.readObject).toHaveBeenCalledWith({ bucket: config.bucketName, key })
    expect(mocks.s3.readObject).toHaveReturned()

    expect(mocks.s3.copyObject).toHaveBeenCalledOnce()
    expect(mocks.s3.copyObject).toHaveBeenCalledWith(
      { bucket: config.bucketName, key },
      { bucket: config.bucketName, key: `${key.replace('uploaded', 'parsed')}` }
    )
    expect(mocks.s3.copyObject).toHaveReturned()

    expect(mocks.s3.deleteObject).toHaveBeenCalledOnce()
    expect(mocks.s3.deleteObject).toHaveBeenCalledWith({ bucket: config.bucketName, key })
    expect(mocks.s3.deleteObject).toHaveReturned()

    const productsInput = await getProductsInput()
    expect(mocks.sqs.sendMessagesInBatch).toHaveBeenCalledOnce()
    expect(mocks.sqs.sendMessagesInBatch).toHaveBeenCalledWith(
      productsInput.map((input) => JSON.stringify(input))
    )
    expect(mocks.sqs.sendMessagesInBatch).toHaveReturned()
  })

  test('should throw FailedToReadObject error if failed to read s3 object', async () => {
    const key = `uploaded/${config.fileName}`

    const error = new FailedToReadObject(key)
    mocks.s3.readObject.mockRejectedValueOnce(error)

    try {
      await handler(event)
    } catch (err) {
      expect(err).toStrictEqual(error)
    }

    expect(mocks.s3.readObject).not.toHaveReturned()
    expect(mocks.s3.copyObject).not.toHaveBeenCalled()
    expect(mocks.s3.deleteObject).not.toHaveBeenCalled()
    expect(mocks.sqs.sendMessagesInBatch).not.toHaveBeenCalled()
  })

  test('should throw Error in case of unknown error', async () => {
    const error = new Error('Internal server error')
    mocks.s3.readObject.mockRejectedValueOnce(error)

    try {
      await handler(event)
    } catch (err) {
      expect(err).toStrictEqual(error)
    }

    expect(mocks.s3.readObject).not.toHaveReturned()
    expect(mocks.s3.copyObject).not.toHaveBeenCalled()
    expect(mocks.s3.deleteObject).not.toHaveBeenCalled()
    expect(mocks.sqs.sendMessagesInBatch).not.toHaveBeenCalled()
  })
})
