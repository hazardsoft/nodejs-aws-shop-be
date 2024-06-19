import { docClient } from '@/helpers/client.js'
import type { Product, Stock } from '@/types.js'
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb'

export const populateProducts = async (products: Product[]) => {
  const command = new BatchWriteCommand({
    RequestItems: {
      ['Products']: products.map((product) => {
        return {
          PutRequest: {
            Item: product
          }
        }
      })
    }
  })

  try {
    const response = await docClient.send(command)
    console.log('populate products:', response)
  } catch (err) {
    console.error('error while populating products: ', err)
  }
}

export const populateStocks = async (stocks: Stock[]) => {
  const command = new BatchWriteCommand({
    RequestItems: {
      ['Stocks']: stocks.map((stock) => {
        return {
          PutRequest: {
            Item: stock
          }
        }
      })
    }
  })

  try {
    const response = await docClient.send(command)
    console.log('populate stocks:', response)
  } catch (err) {
    console.error('error while populating stocks: ', err)
  }
}
