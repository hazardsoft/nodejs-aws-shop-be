import { DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { client } from './client.js'

export const main = async (tableName: string) => {
  const command = new DescribeTableCommand({
    TableName: tableName
  })

  try {
    const response = await client.send(command)
    const itemsCount = response.Table?.ItemCount ?? 0
    console.log(`items in table ${tableName}: `, itemsCount)
    return itemsCount
  } catch (err) {
    console.error(`error while describing table ${tableName}: `, err)
  }
}
