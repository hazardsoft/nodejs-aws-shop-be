import type { Readable } from 'node:stream'
import { parse, type CastingContext } from 'csv-parse'
import type { ProductInput } from '@/types.js'

export const parseProducts = async (stream: Readable): Promise<ProductInput[]> => {
  const data = stream.pipe(
    parse({
      columns: true,
      cast: (value: string, context: CastingContext) => {
        switch (context.column) {
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
  return products
}
