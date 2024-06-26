import type {
  APIGatewayProxyResult,
  S3Event as LibS3Event,
  S3EventRecord as LibS3EventRecord
} from 'aws-lambda'
import { createResponse } from '@/helpers/response.js'
import { FailedToReadObject } from '@/errors.js'
import { read } from '@/helpers/bucket.js'
import type { ProductInput } from '@/types.js'
import { parse } from '@/helpers/parser.js'

type S3Bucket = Pick<LibS3EventRecord['s3']['bucket'], 'name'>
type S3Object = Pick<LibS3EventRecord['s3']['object'], 'key'>
interface S3Record {
  s3: {
    bucket: S3Bucket
    object: S3Object
  }
}
export type S3Event = Omit<LibS3Event, 'Records'> & { Records: S3Record[] }

export const handler = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  console.log('Event: ', event.Records)

  try {
    const products: ProductInput[] = []

    for await (const record of event.Records) {
      const { bucket, object } = record.s3
      const stream = await read(bucket.name, object.key)
      products.push(...(await parse(stream)))
    }
    return createResponse({
      statusCode: 200,
      body: JSON.stringify({ message: 'ok' })
    })
  } catch (err) {
    if (err instanceof FailedToReadObject) {
      return createResponse({
        statusCode: 404,
        body: JSON.stringify({ message: err.message })
      })
    }
    if (err instanceof Error) {
      return createResponse({
        statusCode: 500,
        body: JSON.stringify({ message: err.message })
      })
    }
    return createResponse({
      statusCode: 500,
      body: JSON.stringify({ message: 'get s3 object: unknown error' })
    })
  }
}
