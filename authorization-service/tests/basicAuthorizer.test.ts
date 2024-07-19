import { describe, expect, test } from 'vitest'
import { handler } from '@/handlers/basicAuthorizer.js'
import { createPolicy } from '@/helpers/policy.js'
import { config } from './setup.js'
import type { APIGatewayAuthorizerResult, StatementEffect } from 'aws-lambda'
import { encode } from '@/helpers/token.js'

const createResponse = (
  username: string,
  methodArn: string,
  effect: StatementEffect
): APIGatewayAuthorizerResult => {
  return {
    policyDocument: createPolicy(methodArn, effect),
    principalId: username
  }
}

describe('Basic Authorizer Tests', () => {
  test('should deny if headers are missing', async () => {
    const response = await handler({
      methodArn: config.methodArn,
      headers: null
    })

    expect(response).toMatchObject(createResponse(config.username, config.methodArn, 'Deny'))
  })

  test('should deny if Authorization header is missing', async () => {
    const response = await handler({
      methodArn: config.methodArn,
      headers: {}
    })

    expect(response).toMatchObject(createResponse(config.username, config.methodArn, 'Deny'))
  })

  test('should deny if Authorization header does not contain "Basic"', async () => {
    const response = await handler({
      methodArn: config.methodArn,
      headers: {
        Authorization: 'invalid'
      }
    })

    expect(response).toMatchObject(createResponse(config.username, config.methodArn, 'Deny'))
  })

  test('should allow', async () => {
    const response = await handler({
      methodArn: config.methodArn,
      headers: {
        Authorization: encode(config.username, config.password)
      }
    })

    expect(response).toMatchObject(createResponse(config.username, config.methodArn, 'Allow'))
  })
})
