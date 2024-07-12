import { createPolicy } from '@/helpers/policy.js'
import { decode, validate } from '@/helpers/token.js'
import type {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  StatementEffect
} from 'aws-lambda'

const userName = process.env.USERNAME ?? ''
const userPassword = process.env.PASSWORD ?? ''

export const handler = async (
  event: Pick<APIGatewayRequestAuthorizerEvent, 'methodArn' | 'headers'>
): Promise<APIGatewayAuthorizerResult> => {
  console.log('auth event:', event)

  const createResponse = (effect: StatementEffect): APIGatewayAuthorizerResult => {
    return {
      principalId: userName,
      policyDocument: createPolicy(event.methodArn, effect)
    }
  }

  const token = event.headers?.Authorization

  if (!token || !validate(token)) {
    return createResponse('Deny')
  }

  const [user, password] = decode(token)
  if (user === userName && password === userPassword) {
    return createResponse('Allow')
  }

  return createResponse('Deny')
}
