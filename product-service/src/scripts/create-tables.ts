import { CreateTableCommand } from '@aws-sdk/client-dynamodb'
import { client } from './client.js'

export const createProductsTable = async () => {
  const command = new CreateTableCommand({
    TableName: 'Products',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'title',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'title',
        KeyType: 'RANGE'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  })

  try {
    const response = await client.send(command)
    console.log(response)
    return response
  } catch (err) {
    console.error('error while creating products table: ', err)
  }
}

export const createStocksTable = async () => {
  const command = new CreateTableCommand({
    TableName: 'Stocks',
    AttributeDefinitions: [
      {
        AttributeName: 'product_id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'count',
        AttributeType: 'N'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'product_id',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'count',
        KeyType: 'RANGE'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  })

  try {
    const response = await client.send(command)
    console.log(response)
    return response
  } catch (err) {
    console.error('error while creating stocks table: ', err)
  }
}
