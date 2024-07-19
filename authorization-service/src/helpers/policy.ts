import type { PolicyDocument, StatementEffect } from 'aws-lambda'

export const createPolicy = (methodArn: string, effect: StatementEffect): PolicyDocument => {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['execute-api:Invoke'],
        Effect: effect,
        Resource: methodArn
      }
    ]
  }
}
