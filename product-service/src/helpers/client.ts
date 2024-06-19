import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'dummy',
  }
})
export const docClient = DynamoDBDocumentClient.from(client)
