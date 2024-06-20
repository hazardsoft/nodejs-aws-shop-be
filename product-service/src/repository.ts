import type { AvailableProduct, Product, ProductId, ProductInput, Stock } from '@/types.js'
import { docClient } from '@/helpers/client.js'
import { ProductNotFound } from '@/errors.js'
import {
  ScanCommand,
  BatchGetCommand,
  type ScanCommandOutput,
  TransactWriteCommand
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

type DBScanOutput<T> = Omit<ScanCommandOutput, 'Items'> & { Items?: T[] }

const scan = async <T>(tableName: string): Promise<DBScanOutput<T>> => {
  const command = new ScanCommand({ TableName: tableName })
  return docClient.send(command) as Promise<DBScanOutput<T>>
}

export const getProducts = async (): Promise<AvailableProduct[]> => {
  const products = (await scan<Product>('Products')).Items ?? []
  const stocks = (await scan<Stock>('Stocks')).Items ?? []

  const availableProducts: AvailableProduct[] = products.map((product) => {
    const stock = stocks.find((stock) => stock.product_id === product.id)
    return {
      ...product,
      count: stock?.count || 0
    }
  })
  console.log('available products: ', availableProducts)
  return availableProducts
}

export const getProductById = async (id: ProductId): Promise<AvailableProduct> => {
  const command = new BatchGetCommand({
    RequestItems: {
      Products: {
        Keys: [
          {
            id
          }
        ]
      },
      Stocks: {
        Keys: [
          {
            product_id: id
          }
        ]
      }
    }
  })

  const response = await docClient.send(command)
  if (!response.Responses) {
    throw new ProductNotFound(id)
  }

  const products = response.Responses['Products'] as Product[]
  const stocks = response.Responses['Stocks'] as Stock[]

  if (!products.length || !stocks.length) {
    throw new ProductNotFound(id)
  }

  const product = products[0] as Product
  const stock = stocks[0] as Stock

  const availableProduct: AvailableProduct = {
    ...product,
    count: stock.count
  }
  console.log(`product with id ${id}: `, availableProduct)
  return availableProduct
}

export const createProduct = async (input: ProductInput) => {
  const id = uuidv4()

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: 'Products',
          Item: {
            id,
            ...input
          }
        }
      },
      {
        Put: {
          TableName: 'Stocks',
          Item: {
            product_id: id,
            count: input.count
          }
        }
      }
    ],
    ReturnConsumedCapacity: 'TOTAL'
  })

  const response = await docClient.send(command)
  console.log('product created: ', response)

  const availableProduct: AvailableProduct = {
    id,
    ...input
  }
  return availableProduct
}
