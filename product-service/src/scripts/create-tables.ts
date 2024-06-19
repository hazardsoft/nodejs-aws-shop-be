import { CreateTableCommand } from '@aws-sdk/client-dynamodb'
import { client } from '@/helpers/client.js'

export const createProductsTable = async () => {
  const command = new CreateTableCommand({
    TableName: 'Products',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
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
      }
    ],
    KeySchema: [
      {
        AttributeName: 'product_id',
        KeyType: 'HASH'
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
