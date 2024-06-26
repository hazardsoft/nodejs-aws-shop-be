import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const generatePresignUrl = async (bucket: string, key: string): Promise<string> => {
  const client = new S3Client()
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'text/csv' })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}
