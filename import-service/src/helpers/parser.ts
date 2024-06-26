import type { Readable } from 'node:stream'
import csv from 'csv-parser'
import type { ProductInput } from '@/types.js'

export const parse = async (stream: Readable): Promise<ProductInput[]> => {
  const data = stream.pipe(
    csv({
      mapValues: ({ header, value }) => {
        switch (header) {
          case 'price':
            return parseFloat(value)
          case 'count':
            return parseInt(value)
        }
        return value
      }
    })
  )

  const products: ProductInput[] = []
  for await (const chunk of data) {
    products.push(chunk)
  }
  console.log('parsed products:', products)
  return products
}
