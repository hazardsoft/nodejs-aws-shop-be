import { Stack } from 'aws-cdk-lib'
import { AuthorizationHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'
import { config } from './config.js'

export class AuthorizationService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const { username, password } = config

    new AuthorizationHandlers(this, 'AuthorizationHandlers', {
      username,
      password
    })
  }
}
