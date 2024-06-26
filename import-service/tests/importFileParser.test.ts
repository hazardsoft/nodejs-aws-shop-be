import { describe, expect, test, vi } from 'vitest'
import { handler, type S3Event } from '@/handlers/importFileParser.js'
import { config } from './setup.js'
import { FailedToReadObject } from '@/errors.js'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'node:url'

const mocks = vi.hoisted(() => {
  return {
    readObject: vi.fn(),
    copyObject: vi.fn(),
    deleteObject: vi.fn()
  }
})

vi.mock('@/helpers/bucket.js', () => ({
  readObject: mocks.readObject,
  copyObject: mocks.copyObject,
  deleteObject: mocks.deleteObject
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

  const productsStream = createReadStream(
    fileURLToPath(new URL('data/products.csv', import.meta.url))
  )

  test('should parse products CSV', async () => {
    mocks.readObject.mockResolvedValueOnce(productsStream)

    const result = await handler(event)

    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toMatchObject({ message: 'ok' })

    expect(mocks.readObject).toHaveBeenCalledOnce()
    expect(mocks.readObject).toHaveBeenCalledWith({ bucket: config.bucketName, key })
    expect(mocks.readObject).toHaveReturned()

    expect(mocks.copyObject).toHaveBeenCalledOnce()
    expect(mocks.copyObject).toHaveBeenCalledWith(
      { bucket: config.bucketName, key },
      { bucket: config.bucketName, key: `${key.replace('uploaded', 'parsed')}` }
    )
    expect(mocks.copyObject).toHaveReturned()

    expect(mocks.deleteObject).toHaveBeenCalledOnce()
    expect(mocks.deleteObject).toHaveBeenCalledWith({ bucket: config.bucketName, key })
    expect(mocks.deleteObject).toHaveReturned()
  })

  test('should return 404 if failed to read s3 object', async () => {
    const key = `uploaded/${config.fileName}`

    const error = new FailedToReadObject(key)
    mocks.readObject.mockRejectedValueOnce(error)

    const result = await handler(event)

    expect(result.statusCode).toBe(404)
    expect(JSON.parse(result.body)).toMatchObject({ message: error.message })
    expect(mocks.readObject).not.toHaveReturned()
    expect(mocks.copyObject).not.toHaveBeenCalled()
    expect(mocks.deleteObject).not.toHaveBeenCalled()
  })

  test('should return 500 in case of unknown error', async () => {
    const error = new Error('Internal server error')
    mocks.readObject.mockRejectedValueOnce(error)

    const result = await handler(event)

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)).toMatchObject({ message: error.message })
    expect(mocks.readObject).not.toHaveReturned()
    expect(mocks.copyObject).not.toHaveBeenCalled()
    expect(mocks.deleteObject).not.toHaveBeenCalled()
  })
})
