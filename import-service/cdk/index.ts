import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ImportServiceHandlers } from './constructs/handlers.js'
import { ImportServiceApi } from './constructs/api.js'
import { ImportServiceBucket } from './constructs/bucket.js'

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const bucketConstruct = new ImportServiceBucket(this, 'ImportServiceBucket')

    const { getPresignedUrl } = new ImportServiceHandlers(this, 'ImportServiceHandlers', {
      bucketName: bucketConstruct.uploadBucket.bucketName
    })
    new ImportServiceApi(this, 'ImportServiceApi', {
      handlers: {
        getPresignedUrl
      }
    })
  }
}

const importService = new ImportService(new App(), 'ImportService')
export { importService }
