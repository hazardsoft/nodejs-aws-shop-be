import { createPolicy } from '@/helpers/policy.js'
import { decodeToken } from '@/helpers/token.js'
import type {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  StatementEffect
} from 'aws-lambda'

const userName = process.env.USERNAME ?? ''
const userPassword = process.env.PASSWORD ?? ''
const tokenBeginning = 'Basic '

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

  if (!event.headers?.Authorization || !event.headers.Authorization.startsWith(tokenBeginning)) {
    return createResponse('Deny')
  }

  const token = event.headers.Authorization.split(tokenBeginning)[1]
  if (!token) {
    return createResponse('Deny')
  }

  const [user, password] = decodeToken(token)
  if (user === userName && password === userPassword) {
    return createResponse('Allow')
  }

  return createResponse('Deny')
}
