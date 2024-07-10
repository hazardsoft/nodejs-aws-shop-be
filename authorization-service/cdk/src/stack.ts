import { Stack } from 'aws-cdk-lib'
import { AuthorizationHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'

export class AuthorizationService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    new AuthorizationHandlers(this, 'AuthorizationHandlers')
  }
}
