import type { AvailableProduct, ProductInput } from '@/types.js'
import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? 'Products'
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? 'Stocks'

type TransactItems = NonNullable<TransactWriteCommandInput['TransactItems']>
type TransactItem = TransactItems[number]

type ProductTransactItems = [productPut: TransactItem, stockPut: TransactItem]

interface OneProductTransaction {
  availableProduct: AvailableProduct
  transactItems: ProductTransactItems
}

export const createOneProductTransaction = (product: ProductInput): OneProductTransaction => {
  const id = uuidv4()

  const transactItems: ProductTransactItems = [
    {
      Put: {
        TableName: productsTableName,
        Item: {
          id,
          ...product
        }
      }
    },
    {
      Put: {
        TableName: stocksTableName,
        Item: {
          product_id: id,
          count: product.count
        }
      }
    }
  ]

  return {
    availableProduct: {
      id,
      ...product
    },
    transactItems
  }
}

interface ManyProductsTransaction {
  availableProducts: AvailableProduct[]
  transactItems: TransactItems
}

export const createManyProductsTransaction = (
  products: ProductInput[]
): ManyProductsTransaction => {
  const allTransactItems: TransactItems = Array(products.length * 2)
  const availableProducts: AvailableProduct[] = Array(products.length)

  products.forEach((product, index) => {
    const {
      availableProduct,
      transactItems: [productPut, stockPut]
    } = createOneProductTransaction(product)
    availableProducts[index] = availableProduct
    allTransactItems[index * 2] = productPut
    allTransactItems[index * 2 + 1] = stockPut
  })

  return {
    availableProducts,
    transactItems: allTransactItems
  }
}
