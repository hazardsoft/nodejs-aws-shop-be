import { DynamoDBClient, type DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const config: DynamoDBClientConfig =
  process.env.MODE === 'test'
    ? {
        endpoint: 'http://127.0.0.1:8000',
        credentials: {
          accessKeyId: 'dummy',
          secretAccessKey: 'dummy'
        }
      }
    : {}

export const client = new DynamoDBClient(config)
export const docClient = DynamoDBDocumentClient.from(client)
