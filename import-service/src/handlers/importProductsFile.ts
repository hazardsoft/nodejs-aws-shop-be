import { FilenameInvalidInput } from '@/errors.js'
import { createResponse } from '@/helpers/response.js'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generatePresignUrl } from '@/helpers/sign'

const BUCKET_NAME: string = process.env.BUCKET_NAME ?? ''

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('get presigned url:', event.queryStringParameters, 'bucket name:', BUCKET_NAME)

  try {
    const filename = event.queryStringParameters?.name ?? ''

    if (!filename) {
      throw new FilenameInvalidInput()
    }

    const presignedUrl = await generatePresignUrl(BUCKET_NAME, `uploaded/${filename}`)
    return createResponse({
      statusCode: 200,
      body: presignedUrl
    })
  } catch (e) {
    if (e instanceof FilenameInvalidInput) {
      return createResponse({
        statusCode: 400,
        body: JSON.stringify({ message: e.message })
      })
    }
    if (e instanceof Error) {
      return createResponse({
        statusCode: 500,
        body: JSON.stringify({ message: e.message })
      })
    }
    return createResponse({
      statusCode: 500,
      body: JSON.stringify({ message: 'get presigned url: unknown error' })
    })
  }
}
