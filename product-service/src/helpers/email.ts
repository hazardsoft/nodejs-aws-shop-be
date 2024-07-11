import { StockStatus, type AvailableProduct, type EmailAttributes } from '@/types.js'

interface Email {
  subject: string
  body: string
}
export const getEmail = (products: AvailableProduct[]): Email => {
  return {
    subject: 'Products added',
    body: getBody(products)
  }
}

const getBody = (products: AvailableProduct[]) => {
  let body = `Products added (${products.length}):`
  body += '\r\n'
  products.forEach((product, index) => {
    body += `${getProductDescription(index + 1, product)}\r\n`
  })

  return body
}

const getProductDescription = (index: number, product: AvailableProduct) => {
  const parts: string[] = []
  parts.push(`${index}. title: '${product.title}'`)
  parts.push(`description: '${product.description}'`)
  parts.push(`count: ${product.count}`)
  parts.push(`price: ${product.price}`)
  return parts.join(', ')
}

export const getEmailAttributes = (products: AvailableProduct[]): EmailAttributes => {
  const isProductWithZeroStock = products.some(
    (product) => product.count === 0 || product.count === undefined
  )
  return {
    stockStatus: isProductWithZeroStock ? StockStatus.SOME_OUT_OF_STOCK : StockStatus.ALL_IN_STOCK
  }
}
