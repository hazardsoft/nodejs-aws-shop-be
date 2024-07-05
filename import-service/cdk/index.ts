import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ImportServiceHandlers } from './constructs/handlers.js'
import { ImportServiceApi } from './constructs/api.js'
import { ImportServiceBucket } from './constructs/bucket.js'
import { bucket } from './config.js'
import { ImportServiceQueue } from './constructs/queue.js'

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const bucketConstruct = new ImportServiceBucket(this, 'ImportServiceBucket')
    const queueConstruct = new ImportServiceQueue(this, 'ImportServiceQueue')

    const { getPresignedUrl, parseProducts } = new ImportServiceHandlers(
      this,
      'ImportServiceHandlers',
      {
        bucketName: bucketConstruct.uploadBucket.bucketName,
        queueUrl: queueConstruct.queue.queueUrl
      }
    )
    // presign handler should be able to put objects only
    bucketConstruct.grantPut(getPresignedUrl, bucket.uploadKeyPrefix)

    // parse products handler should be able to get/put/delete objects
    bucketConstruct.notify(parseProducts, bucket.uploadKeyPrefix)
    bucketConstruct.grantGet(parseProducts, bucket.uploadKeyPrefix)
    bucketConstruct.grantPut(parseProducts, bucket.parseKeyPrefix)
    bucketConstruct.grantDelete(parseProducts, bucket.uploadKeyPrefix)

    queueConstruct.grantSendMessages(parseProducts)

    new ImportServiceApi(this, 'ImportServiceApi', { handlers: { getPresignedUrl } })
  }
}

const importService = new ImportService(new App(), 'ImportService')
export { importService }
