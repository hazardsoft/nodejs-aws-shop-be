import { describe, expect, test, vi } from 'vitest'
import { handler } from '@/handlers/importProductsFile.js'
import { config } from './setup.js'
import { FilenameInvalidInput } from '@/errors.js'

const mocks = vi.hoisted(() => {
  return {
    generatePresignUrl: vi.fn()
  }
})

vi.mock('@/helpers/sign.js', () => ({
  generatePresignUrl: mocks.generatePresignUrl
}))

describe('Get presigned url for CSV file upload tests', () => {
  test('should return a presigned url', async () => {
    const key = `uploaded/${config.fileName}`
    const presignedUrl = `${config.bucketName}/${key}`
    mocks.generatePresignUrl.mockReturnValueOnce(presignedUrl)

    const result = await handler({
      queryStringParameters: {
        name: config.fileName
      }
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(presignedUrl)
    expect(mocks.generatePresignUrl).toHaveBeenCalledOnce()
    expect(mocks.generatePresignUrl).toHaveBeenCalledWith(config.bucketName, key)
    expect(mocks.generatePresignUrl).toHaveLastReturnedWith(presignedUrl)
  })

  test('should return 400 if file name is invalid', async () => {
    const invalidFilename = ''
    const error = new FilenameInvalidInput()

    const result = await handler({
      queryStringParameters: {
        name: invalidFilename
      }
    })

    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body)).toMatchObject({
      message: error.message
    })
    expect(mocks.generatePresignUrl).not.toHaveBeenCalled()
  })

  test('should return 500 if presigner throws', async () => {
    const error = new Error('Internal server error')
    mocks.generatePresignUrl.mockRejectedValueOnce(error)

    const result = await handler({
      queryStringParameters: {
        name: config.fileName
      }
    })

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)).toMatchObject({
      message: error.message
    })
    expect(mocks.generatePresignUrl).not.toHaveReturned()
  })
})
