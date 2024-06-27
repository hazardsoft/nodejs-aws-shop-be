import { describe, expect, test, vi } from 'vitest'
import { handler } from '@/handlers/importProductsFile.js'
import { config } from './setup.js'
import { FilenameInvalidInput } from '@/errors.js'
import { FilenameValidationErrors } from '@/types.js'

const mocks = vi.hoisted(() => {
  return {
    generatePresignUrl: vi.fn()
  }
})

vi.mock('@/helpers/bucket.js', () => ({
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
    expect(result.headers).toMatchObject({
      'Content-Type': 'text/plain'
    })
    expect(mocks.generatePresignUrl).toHaveBeenCalledOnce()
    expect(mocks.generatePresignUrl).toHaveBeenCalledWith(config.bucketName, key)
    expect(mocks.generatePresignUrl).toHaveLastReturnedWith(presignedUrl)
  })

  test('should return 400 if file name is empty', async () => {
    const emptyFilename = ''
    const error = new FilenameInvalidInput()

    const result = await handler({
      queryStringParameters: {
        name: emptyFilename
      }
    })

    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body)).toMatchObject({
      message: error.message
    })
    expect(mocks.generatePresignUrl).not.toHaveBeenCalled()
  })

  test('should return 400 if file name is invalid', async () => {
    const invalidFilename = '.csv'
    const issues = [FilenameValidationErrors.FILE_MUST_BE_CSV]
    const error = new FilenameInvalidInput(issues)

    const result = await handler({
      queryStringParameters: {
        name: invalidFilename
      }
    })

    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body)).toMatchObject({
      message: error.message,
      issues: error.issues
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
