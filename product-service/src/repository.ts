import type { AvailableProduct, Product, Stock } from '@/types.js'
import { docClient } from '@/helpers/client.js'
import { ProductsFailToGetAll } from '@/errors.js'
import { ScanCommand, type ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

type DBScanOutput<T> = Omit<ScanCommandOutput, 'Items'> & { Items?: T[] }

const scan = async <T>(tableName: string): Promise<DBScanOutput<T>> => {
  const command = new ScanCommand({ TableName: tableName })
  return docClient.send(command) as Promise<DBScanOutput<T>>
}

export const getProducts = async () => {
  try {
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
  } catch (e) {
    throw new ProductsFailToGetAll(JSON.stringify(e))
  }
}
