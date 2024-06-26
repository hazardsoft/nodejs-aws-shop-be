import { describe, expect, test, vi } from 'vitest'
import { handler, type S3Event } from '@/handlers/importFileParser.js'
import { config } from './setup.js'
import { FailedToReadObject } from '@/errors.js'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'node:url'

const mocks = vi.hoisted(() => {
  return {
    read: vi.fn()
  }
})

vi.mock('@/helpers/bucket.js', () => ({
  read: mocks.read
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
    mocks.read.mockResolvedValueOnce(productsStream)

    const result = await handler(event)

    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toMatchObject({ message: 'ok' })
    expect(mocks.read).toHaveBeenCalledOnce()
    expect(mocks.read).toHaveBeenCalledWith(config.bucketName, key)
    expect(mocks.read).toHaveReturned()
  })

  test('should return 404 if failed to read s3 object', async () => {
    const key = `uploaded/${config.fileName}`

    const error = new FailedToReadObject(key)
    mocks.read.mockRejectedValueOnce(error)

    const result = await handler(event)

    expect(result.statusCode).toBe(404)
    expect(JSON.parse(result.body)).toMatchObject({ message: error.message })
    expect(mocks.read).not.toHaveReturned()
  })

  test('should return 500 in case of unknown error', async () => {
    const error = new Error('Internal server error')
    mocks.read.mockRejectedValueOnce(error)

    const result = await handler(event)

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)).toMatchObject({ message: error.message })
    expect(mocks.read).not.toHaveReturned()
  })
})
