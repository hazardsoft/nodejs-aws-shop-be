import type { S3Event as LibS3Event, S3EventRecord as LibS3EventRecord } from 'aws-lambda'
import { copyObject, deleteObject, readObject } from '@/helpers/bucket.js'
import type { ProductInput } from '@/types.js'
import { parseProducts } from '@/helpers/parser.js'
import { sendMessagesInBatch } from '@/helpers/queue.js'

type S3Bucket = Pick<LibS3EventRecord['s3']['bucket'], 'name'>
type S3Object = Pick<LibS3EventRecord['s3']['object'], 'key'>
interface S3Record {
  s3: {
    bucket: S3Bucket
    object: S3Object
  }
}
export type S3Event = Omit<LibS3Event, 'Records'> & { Records: S3Record[] }

export const handler = async (event: S3Event): Promise<void> => {
  console.log('Event: ', event.Records)

  try {
    const allProducts: ProductInput[] = []

    for await (const record of event.Records) {
      const { bucket, object } = record.s3
      const stream = await readObject({ bucket: bucket.name, key: object.key })
      const products = await parseProducts(stream)
      console.log('parsed chunk of products:', products)
      allProducts.push(...products)

      // once parsed move file from /uploaded to /parsed
      await copyObject(
        { bucket: bucket.name, key: object.key },
        { bucket: bucket.name, key: `${object.key.replace('uploaded', 'parsed')}` }
      )
      // delete original file from /uploaded
      await deleteObject({ bucket: bucket.name, key: object.key })
    }
    console.log('all parsed products:', allProducts)
    await sendMessagesInBatch(allProducts.map((product) => JSON.stringify(product)))
    console.log('all messages sent')
  } catch (err) {
    console.error('error occured while parsing products', err)
  }
}
