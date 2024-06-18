import { ListTablesCommand } from '@aws-sdk/client-dynamodb'
import { client } from './client.js'

export const main = async () => {
  const command = new ListTablesCommand({})

  try {
    const response = await client.send(command)
    return response.TableNames ?? []
  } catch (err) {
    console.error('list tables error: ', err)
  }
}
