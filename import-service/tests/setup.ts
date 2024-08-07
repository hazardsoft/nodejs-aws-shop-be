import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { ProductInput } from '@/types'
import { parseProducts } from '@/helpers/parser.js'

export const config = {
  bucketName: 'testBucket',
  fileName: 'test.csv'
}

export const getProductsStream = () => {
  return createReadStream(fileURLToPath(new URL('data/products.csv', import.meta.url)))
}

export const getProductsInput = async (): Promise<ProductInput[]> => {
  return parseProducts(getProductsStream())
}
