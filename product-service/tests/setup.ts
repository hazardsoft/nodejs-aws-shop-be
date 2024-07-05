import type { SQSEvent as LibSQSEvent, SQSRecord as LibSQSRecord } from 'aws-lambda'
import type { ProductInput } from '@/types.js'
import data from '@/data/products.json'

export const config = {
  topicArn: 'testTopicArn',
  email: 'test@gmail.com'
}

export const manyProductsInput: ProductInput[] = data.products.map((product) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...input } = product
  return input
})

export const oneProductInput: ProductInput = manyProductsInput[0] as ProductInput

type SQSEvent = Omit<LibSQSEvent, 'Records'> & { Records: Pick<LibSQSRecord, 'body'>[] }

export const sqsEvent: SQSEvent = {
  Records: manyProductsInput.map((product) => {
    return {
      body: JSON.stringify(product)
    }
  })
}
