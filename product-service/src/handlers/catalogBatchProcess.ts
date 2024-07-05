import type { SQSEvent, SQSRecord } from 'aws-lambda'
import { validateProduct } from '@/helpers/validate.js'
import { createProductsInBatch } from '@/repository.js'
import type { AvailableProduct, ProductInput } from '@/types.js'
import { sendNotification } from '@/topic.js'

type Event = Omit<SQSEvent, 'Records'> & { Records: Pick<SQSRecord, 'body'>[] }

const topicArn: string = process.env.TOPIC_ARN ?? ''

export const handler = async (event: Event): Promise<AvailableProduct[]> => {
  console.log('received messages num:', event.Records.length)
  try {
    const products: ProductInput[] = event.Records.reduce((acc, cur) => {
      const product = processMessage(cur.body)
      if (product) {
        acc.push(product)
      }
      return acc
    }, [] as ProductInput[])
    console.log('parsed products num:', products.length)
    console.log('parsed products input:', products)
    const availableProducts = await createProductsInBatch(products)
    console.log('available products created in batch:', availableProducts)

    const notification = {
      subject: 'Products added',
      body: `Products added: ${availableProducts.map((product) => JSON.stringify(product)).join('; ')}`
    }
    await sendNotification(topicArn, notification.subject, notification.body)
    console.log('notification sent')

    return availableProducts
  } catch (err) {
    console.error('error occured while parsing products:', err)
    return []
  }
}

const processMessage = (message: string): ProductInput | null => {
  const validationResult = validateProduct(JSON.parse(message))
  if (!validationResult.success) {
    console.error('failed to validate product:', validationResult.issues)
  }
  return validationResult.success ? validationResult.data : null
}
