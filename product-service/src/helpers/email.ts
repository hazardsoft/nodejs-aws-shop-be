import type { AvailableProduct } from '@/types'

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
