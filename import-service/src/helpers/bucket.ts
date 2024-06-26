import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type GetObjectCommandOutput
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { FailedToReadObject } from '@/errors.js'
import type { Readable } from 'node:stream'

const client = new S3Client()
type S3GetObjectCommandOutput = Omit<GetObjectCommandOutput, 'Body'> & { Body: Readable }

export const generatePresignUrl = async (bucket: string, key: string): Promise<string> => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'text/csv' })
  return getSignedUrl(client, command, { expiresIn: 60 })
}

export const read = async (bucket: string, key: string): Promise<Readable> => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const response = (await client.send(command)) as S3GetObjectCommandOutput
  if (response.$metadata.httpStatusCode !== 200) {
    throw new FailedToReadObject(key)
  }
  return response.Body
}
