import type { AvailableProduct, Product, ProductId, ProductInput, Stock } from '@/types.js'
import { docClient } from '@/helpers/client.js'
import { ProductCreationFail, ProductNotFound } from '@/errors.js'
import {
  ScanCommand,
  BatchGetCommand,
  type ScanCommandOutput,
  TransactWriteCommand,
  type BatchGetCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

type DBScanOutput<T> = Omit<ScanCommandOutput, 'Items'> & { Items?: T[] }
type DBBatchGetItemOutput<T> = Omit<BatchGetCommandOutput, 'Responses'> & {
  Responses?: Record<string, T[]>
}

const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? 'Products'
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? 'Stocks'

const scan = async <T>(tableName: string): Promise<DBScanOutput<T>> => {
  const command = new ScanCommand({ TableName: tableName })
  return docClient.send(command) as Promise<DBScanOutput<T>>
}

export const getProducts = async (): Promise<AvailableProduct[]> => {
  const products = (await scan<Product>(productsTableName)).Items ?? []

  const getStocksCommand = new BatchGetCommand({
    RequestItems: {
      [stocksTableName]: {
        Keys: products.map(({ id }) => {
          return {
            product_id: id
          }
        })
      }
    }
  })

  const stocksResponse = (await docClient.send(getStocksCommand)) as DBBatchGetItemOutput<Stock>
  const stocks = (stocksResponse.Responses && stocksResponse.Responses[stocksTableName]) ?? []

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
      [productsTableName]: {
        Keys: [
          {
            id
          }
        ]
      },
      [stocksTableName]: {
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

  const products = response.Responses[productsTableName] as Product[]
  const stocks = response.Responses[stocksTableName] as Stock[]

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
          TableName: productsTableName,
          Item: {
            id,
            ...input
          }
        }
      },
      {
        Put: {
          TableName: stocksTableName,
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
  if (response.$metadata.httpStatusCode !== 200) {
    throw new ProductCreationFail()
  }

  const availableProduct: AvailableProduct = {
    id,
    ...input
  }
  return availableProduct
}
