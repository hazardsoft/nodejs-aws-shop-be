import type { AvailableProduct, Product, ProductId, Stock } from '@/types.js'
import { docClient } from '@/helpers/client.js'
import { FailedToGetProductById, ProductNotFound } from '@/errors.js'
import { ScanCommand, BatchGetCommand, type ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

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
    throw new FailedToGetProductById(id)
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
