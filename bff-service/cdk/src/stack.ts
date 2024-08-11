import { Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { config } from './config'
import { BffServiceHttpApi } from './constructs/httpApi'

export class BffService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        account: config.account.id,
        region: config.account.region
      }
    })

    new BffServiceHttpApi(this, 'BffServiceHttpApi', {
      serverUrl: config.servers.bff.url
    })
  }
}
